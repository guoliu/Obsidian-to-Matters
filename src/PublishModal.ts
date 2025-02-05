import { ButtonComponent, MarkdownRenderer, Notice, setIcon, Setting } from 'obsidian';

import Publisher from '../main';
import { QueryModal } from './QueryModal';
import { GET_ARTICLE, PUBLISH_ARTICLE, PUT_DRAFT, GET_PUBLISHED_ARTICLE } from './operations';

import type {
  PutDraftInput,
  ArticleLicenseType,
  PutDraftMutation,
  PublishArticleInput,
  GetArticleQuery,
  ArticleInput,
  PublishArticleMutation,
  NodeInput,
  GetPublishedArticleQuery,
} from './generated/graphql';

import Description from './components/Description.svelte';
import { mount } from 'svelte';
import { draftStore } from './stores';
import { WEB_DOMAINS } from './settings';
import { translations } from './translations';
// import ModalContent from './components/ModalContent.svelte';

export interface Draft {
  id?: string;
  title: string;
  content: string;
  settings: {
    summary?: string | null;
    tags: string[];
    collection: { url: string; id?: string; title?: string }[];
    license: string;
    allowComments: boolean;
  };
}

type ButtonUpdate = (state: 'upload' | 'publish' | 'loading') => void;

export class PublishModal extends QueryModal {
  updateButton: ButtonUpdate;
  // default metadata of article
  // align with Obsidian editor (instead of Matters schema)
  draft: Draft = {
    title: '',
    content: '',
    settings: {
      summary: '',
      tags: [],
      collection: [],
      license: 'CC0',
      allowComments: true,
    },
  };

  constructor(plugin: Publisher) {
    super(plugin);
  }

  // map of readable license to Matters API license
  private licenseMap: Record<string, ArticleLicenseType> = {
    cc0: 'cc_0',
    ccbyncnd2: 'cc_by_nc_nd_2',
    ccbyncnd4: 'cc_by_nc_nd_4',
    allrightsreserved: 'arr',
  };

  // get Matters article info from url
  async getArticleFromUrl(url: string) {
    if (!url.includes('matters.town')) {
      console.error('Only accept URL of Matters article');
      return null;
    }

    const shortHash = url.split('/a/')[1].split('?')[0];

    try {
      const data = await this.sendQuery<GetArticleQuery, ArticleInput>(GET_ARTICLE, { shortHash });

      return data.article;
    } catch (error) {
      console.error('Failed to fetch article title:', error);
      return null;
    }
  }

  async onOpen() {
    // Add loading spinner
    const loadingEl = this.contentEl.createDiv({
      attr: { style: 'height: 150px;' },
    });
    loadingEl.addClass('loading');
    setIcon(loadingEl, 'loader-circle');

    // checks
    const currentFile = this.app.workspace.getActiveFile();
    if (!currentFile) {
      new Notice(translations().notices.noActiveFile);
      return;
    }

    const isValid = await this.verifyToken();
    if (!isValid) {
      new Notice(translations().notices.invalidToken);
      return;
    }

    // get and set title
    const title = currentFile.basename;
    this.setTitle(title);
    this.draft.title = title;

    // get md content without frontmatter
    const md = await this.app.vault.read(currentFile);
    const cache = this.app.metadataCache.getFileCache(currentFile);
    const contentWithoutFrontmatter =
      cache?.sections?.[0]?.type === 'yaml'
        ? md.slice(cache.sections[0].position.end.offset + 1)
        : md;

    // render html into contentEl
    await MarkdownRenderer.render(
      this.app,
      contentWithoutFrontmatter,
      this.contentEl,
      currentFile.path,
      this.plugin
    );

    // read in content for draft
    this.draft.content = this.contentEl.innerHTML;
    // remove loading spinner
    loadingEl.remove();

    // extract properties from frontmatter
    for (const key in this.draft.settings) {
      const property = cache?.frontmatter?.[translations().frontmatter[key]];

      if (property) {
        // handle collection
        if (key === 'collection') {
          this.draft.settings['collection'] = property.map((url: string) => ({ url }));
        } else {
          // other properties
          this.draft.settings[key] = property;
        }
      }
    }

    // Create description section
    const descriptionEl = this.contentEl.createDiv();

    // Create setting section, append description and button
    const settingEl = new Setting(this.contentEl);
    settingEl.settingEl.style.alignItems = 'flex-end';
    settingEl
      .setDesc(
        createFragment((el) => {
          el.appendChild(descriptionEl);
        })
      )
      .addButton((btn) => {
        // set button width and margin
        // btn.buttonEl.style.minWidth = `${btn.buttonEl.offsetWidth}px`;
        // btn.buttonEl.style.marginBottom = '8px';

        this.updateButton = updateFactory(
          btn,
          this.uploadDraft.bind(this),
          this.publishArticle.bind(this),
          this.modalEl
        );

        // buttom ready for upload
        this.updateButton('upload');

        return btn;
      });

    // Mount Svelte component
    mount(Description, {
      target: descriptionEl,
      props: {
        draft: this.draft,
        environment: this.plugin.settings.environment,
      },
    });

    // Fetch and update collection
    Promise.all(
      this.draft.settings['collection'].map(async ({ url }, index) => {
        const article = await this.getArticleFromUrl(url);
        if (article) {
          const { id, title } = article;
          // get id & title
          this.draft.settings['collection'][index] = { url, id, title };
        } else {
          new Notice(translations().notices.failCollection + url);
        }
      })
    ).then(() => {
      draftStore.set(this.draft);
    });
  }

  private async uploadDraft() {
    // show spinner
    this.updateButton('loading');

    try {
      // deconstruct draft, get license, allowComments, and collection
      const { title: localTitle, content: localContent } = this.draft;
      const {
        license: licenseString,
        allowComments,
        collection: localCollection,
        ...restSettings
      } = this.draft.settings;

      // translate license to Matters API, using CC0 as default
      const licenseKey = licenseString.replace(/\s+/g, '').toLowerCase();
      const license = this.licenseMap[licenseKey] || 'cc_0';

      // upload draft
      const data = await this.sendQuery<PutDraftMutation, PutDraftInput>(PUT_DRAFT, {
        ...restSettings,
        title: localTitle,
        content: localContent,
        collection: localCollection.map(({ id }) => id),
        license,
        canComment: allowComments,
      });

      new Notice(translations().notices.uploadedDraft);

      // get server version of draft
      const { id, content, title, collection, ...restDraft } = data.putDraft;
      this.draft = {
        ...this.draft,
        id,
        content,
        title,
        settings: { ...this.draft.settings, ...restDraft },
      };
      // update collection
      this.draft.settings['collection'] = collection.edges.map(({ node: { id, title } }) => ({
        url: this.draft.settings['collection'].filter(
          ({ id: collectionId }) => collectionId === id
        )[0].url,
        id,
        title,
      }));

      //update draft store
      draftStore.set(this.draft);

      // ready for publish
      this.updateButton('publish');
    } catch (error) {
      console.error('Failed to upload draft:', error);
      new Notice(translations().notices.failUploadDraft);

      // ready for upload
      this.updateButton('upload');
    }
  }

  private async publishArticle() {
    try {
      // loading
      this.updateButton('loading');
      // trigger publish
      await this.sendQuery<PublishArticleMutation, PublishArticleInput>(PUBLISH_ARTICLE, {
        id: this.draft.id,
      });

      // poll for published article status every 2 seconds
      let attempts = 0;
      const maxAttempts = 10;
      let publishedDraft;
      while (attempts < maxAttempts && !publishedDraft?.node?.article?.id) {
        attempts++;
        publishedDraft = await this.sendQuery<GetPublishedArticleQuery, NodeInput>(
          GET_PUBLISHED_ARTICLE,
          {
            id: this.draft.id,
          },
          true
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const shortHash = publishedDraft?.node?.article?.shortHash;
      if (shortHash) {
        const url = `${WEB_DOMAINS[this.plugin.settings.environment]}/a/${shortHash}`;
        window.open(url);
        this.close();
      } else {
        new Notice(translations().notices.failPublishDraft);
        this.updateButton('publish');
      }
    } catch (error) {
      console.error('Failed to publish draft:', error);
      new Notice(translations().notices.failPublishDraft);
    }
  }
}

const updateFactory = (
  button: ButtonComponent,
  upload: () => void,
  publish: () => void,
  modalContentEl: HTMLElement
) =>
  ((state) => {
    if (state === 'upload') {
      // button ready for upload
      button
        .setIcon('upload')
        .setCta()
        .onClick(upload)
        .setDisabled(false)
        .buttonEl.removeClass('loading');

      button.buttonEl.append(
        createSpan({ text: translations().upload, attr: { style: `margin-left: 8px` } })
      );
      button.buttonEl.style.minWidth = `72px`;
    } else if (state === 'publish') {
      // ready for publish
      button
        .setIcon('send')
        .setCta()
        .onClick(publish)
        .setDisabled(false)
        .buttonEl.removeClass('loading');

      button.buttonEl.append(
        createSpan({ text: translations().publish, attr: { style: `margin-left: 8px` } })
      );
      button.buttonEl.style.minWidth = `72px`;
    } else if (state === 'loading') {
      // loading
      button.setDisabled(true).setButtonText('').setIcon('loader-2').buttonEl.addClass('loading');
      button.buttonEl.style.minWidth = `72px`;
    }

    // Keep modal scrolled to the bottom after updating button content.
    // Use requestAnimationFrame to ensure the DOM has updated.
    requestAnimationFrame(() => {
      modalContentEl.scrollTop = modalContentEl.scrollHeight;
    });
  }) as ButtonUpdate;
