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

export class PublishModal extends QueryModal {
  button: ButtonComponent;
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
  private async getArticleFromUrl(url: string) {
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

    try {
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
            // Type assertion to handle indexing with string key
            this.draft.settings[key] = property;
          }
        }
      }

      // Create description section
      const descriptionEl = this.contentEl.createDiv();
      // Mount Svelte component
      mount(Description, {
        target: descriptionEl,
        props: {
          draft: this.draft,
          environment: this.plugin.settings.environment,
        },
      });

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
          btn.setIcon('upload').setCta().onClick(this.onSubmit.bind(this));
          btn.buttonEl.append(createSpan({ text: 'Upload', attr: { style: `margin-left: 8px` } }));
          btn.buttonEl.style.minWidth = `${btn.buttonEl.offsetWidth}px`;
          btn.buttonEl.style.marginBottom = '8px';
          this.button = btn;
          return btn;
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
            new Notice(`Failed to fetch article in collection: ${url}`);
          }
        })
      ).then(() => {
        draftStore.set(this.draft);
      });
    } catch (error) {
      new Notice('Failed to load article data: ' + error.message);
      console.error(error);
    }
  }

  private async uploadDraft() {
    // show spinner
    this.button.setButtonText('').setIcon('loader-circle').buttonEl.addClass('loading');
    this.button.setDisabled(true);

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

      new Notice(`Draft uploaded.`);

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
    } catch (error) {
      console.error('Failed to upload draft:', error);
      new Notice('Failed to upload draft:' + error.message);
    } finally {
      // remove loader
      this.button.buttonEl.removeClass('loading');
      this.button.setDisabled(false);
      this.button.setButtonText('Publish draft');

      // scroll button into view with a slight delay
      setTimeout(() => {
        this.button.buttonEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }

  private async publishArticle() {
    try {
      // show spinner
      this.button.setButtonText('').setIcon('loader-2').buttonEl.addClass('loading');
      this.button.setDisabled(true);

      // trigger publish
      const data = await this.sendQuery<PublishArticleMutation, PublishArticleInput>(
        PUBLISH_ARTICLE,
        {
          id: this.draft.id,
        }
      );

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
      } else {
        new Notice('Failed to publish draft');
      }
    } catch (error) {
      console.error('Failed to publish draft:', error);
      new Notice('Failed to publish draft:' + error.message);
    } finally {
      this.button.buttonEl.removeClass('loading');
      this.button.setDisabled(false);
      this.button.setButtonText('Publish draft');
    }
  }

  private async onSubmit() {
    if (!this.draft.id) {
      await this.uploadDraft();
    } else {
      await this.publishArticle();
    }
  }
}
