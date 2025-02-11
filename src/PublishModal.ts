import {
  ButtonComponent,
  FileSystemAdapter,
  MarkdownRenderer,
  Notice,
  setIcon,
  Setting,
} from 'obsidian';
import type { DraftSettings, ArticleLicenseType } from './types/article';

import Publisher from '../main';
import { QueryModal } from './QueryModal';
import {
  GET_ARTICLE,
  PUBLISH_ARTICLE,
  PUT_DRAFT,
  GET_PUBLISHED_ARTICLE,
  DIRECT_IMAGE_UPLOAD,
} from './operations';

import type {
  PutDraftInput,
  PutDraftMutation,
  PublishArticleInput,
  GetArticleQuery,
  ArticleInput,
  PublishArticleMutation,
  NodeInput,
  GetPublishedArticleQuery,
  DirectImageUploadInput,
  DirectImageUploadMutation,
} from './generated/graphql';

import { Description } from './components/Description';
import { ImageUploadOverlay } from './components/ImageUploadOverlay';
import { WEB_DOMAINS } from './settings';
import { translations } from './translations';

type ButtonUpdate = (state: 'upload' | 'publish' | 'loading') => void;

export class PublishModal extends QueryModal {
  updateButton: ButtonUpdate;
  // default metadata of article
  // align with Obsidian editor (instead of Matters schema)
  draftSettings: DraftSettings = {
    summary: '',
    tags: [],
    collection: [],
    license: 'CC0',
    allowComments: true,
  };
  draftEl: HTMLElement;
  private successCount = 0;
  private failedCount = 0;
  description: Description;

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
    this.setTitle(currentFile.basename);

    // get md content without frontmatter
    const md = await this.app.vault.read(currentFile);
    const cache = this.app.metadataCache.getFileCache(currentFile);
    const contentWithoutFrontmatter =
      cache?.sections?.[0]?.type === 'yaml'
        ? md.slice(cache.sections[0].position.end.offset + 1)
        : md;

    // render html into contentEl
    this.draftEl = this.contentEl.createEl('article');
    await MarkdownRenderer.render(
      this.app,
      contentWithoutFrontmatter,
      this.draftEl,
      currentFile.path,
      this.plugin
    );

    // remove loading spinner
    loadingEl.remove();

    // extract properties from frontmatter
    for (const key in this.draftSettings) {
      const property = cache?.frontmatter?.[translations().frontmatter[key]];

      if (property) {
        // handle collection
        if (key === 'collection') {
          this.draftSettings['collection'] = property.map((url: string) => ({ url }));
        } else {
          // other properties
          this.draftSettings[key] = property;
        }
      }
    }

    // Create setting section, append description and button
    const settingEl = new Setting(this.contentEl);
    settingEl.settingEl.style.alignItems = 'flex-end';
    settingEl
      .setDesc(
        createFragment((el) => {
          const descriptionEl = createDiv();
          el.appendChild(descriptionEl);

          this.description = new Description(
            descriptionEl,
            this.draftSettings,
            this.plugin.settings.environment
          );
        })
      )
      .addButton((btn) => {
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

    // Fetch and update collection
    Promise.all(
      this.draftSettings['collection'].map(async ({ url }, index) => {
        const article = await this.getArticleFromUrl(url);
        if (article) {
          const { id, title } = article;
          // get id & title
          this.draftSettings['collection'][index] = { url, id, title };
        } else {
          new Notice(translations().notices.failCollection + url);
        }
      })
    ).then(() => {
      this.description.update(this.draftSettings);
    });
  }

  async handleImages() {
    // Reset counters
    this.successCount = 0;
    this.failedCount = 0;

    const images = this.draftEl.querySelectorAll('img');

    // Filter for local images and prepare upload tasks
    const uploadTasks = Array.from(images)
      .filter((img) => {
        const src = img.getAttribute('src');
        return src && !src.startsWith('data:') && !src.startsWith('http');
      })
      .map((img) => this.uploadImage(img));

    // Process uploads concurrently
    await Promise.allSettled(uploadTasks);

    // Show final notification
    if (this.successCount > 0 || this.failedCount > 0) {
      new Notice(
        `${this.successCount} images uploaded successfully` +
          (this.failedCount > 0 ? `, ${this.failedCount} failed` : '')
      );
    }
  }

  async uploadDraft() {
    // show spinner
    this.updateButton('loading');

    try {
      // deconstruct draft, get license, allowComments, and collection
      const content = this.draftEl.innerHTML;
      const title = this.titleEl.textContent;
      const {
        license: licenseString,
        allowComments,
        collection: localCollection,
        ...restSettings
      } = this.draftSettings;

      // translate license to Matters API, using CC0 as default
      const licenseKey = licenseString.replace(/\s+/g, '').toLowerCase();
      const license = this.licenseMap[licenseKey] || 'cc_0';

      // create draft (without images)
      const draftInput = {
        ...restSettings,
        title,
        content,
        collection: localCollection.map(({ id }) => id),
        license,
        canComment: allowComments,
      };
      const {
        putDraft: { id: draftId },
      } = await this.sendQuery<PutDraftMutation, PutDraftInput>(PUT_DRAFT, draftInput);

      this.draftSettings.id = draftId;

      // upload images
      await this.handleImages();

      // update draft with images
      const {
        putDraft: { content: remoteContent, title: remoteTitle, collection, ...restDraft },
      } = await this.sendQuery<PutDraftMutation, PutDraftInput>(PUT_DRAFT, {
        ...draftInput,
        id: this.draftSettings.id,
        content: this.draftEl.innerHTML,
      });

      new Notice(translations().notices.uploadedDraft);

      // update collection
      if (collection && collection.edges.length > 0) {
        this.draftSettings['collection'] = collection.edges.map(({ node: { id, title } }) => ({
          url: this.draftSettings['collection'].filter(
            ({ id: collectionId }) => collectionId === id
          )[0].url,
          id,
          title,
        }));
      }

      // update rest of draft settings
      this.draftSettings = {
        ...this.draftSettings,
        ...restDraft,
      };

      // update modal content
      this.titleEl.textContent = remoteTitle;

      // Store dimensions and scroll position before update
      const { width, height } = this.draftEl.getBoundingClientRect();
      const scrollPos = this.draftEl.scrollTop;

      // Temporarily fix dimensions
      this.draftEl.style.width = `${width}px`;
      this.draftEl.style.height = `${height}px`;

      // Update content
      this.draftEl.innerHTML = remoteContent;
      //update description
      this.description.update(this.draftSettings);

      // Restore scroll position
      this.draftEl.scrollTop = scrollPos;

      // Remove fixed dimensions after a brief delay to allow content to settle
      requestAnimationFrame(() => {
        this.draftEl.style.width = '';
        this.draftEl.style.height = '';
      });

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
        id: this.draftSettings.id,
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
            id: this.draftSettings.id,
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

  async uploadImage(imgElement: HTMLImageElement) {
    // Find existing figure or create new one
    let figure = imgElement.closest('figure');
    if (!figure) {
      figure = document.createElement('figure');
      figure.classList.add('image');
      figure.style.position = 'relative';

      // Preserve dimensions before swap
      const width = imgElement.width;
      const height = imgElement.height;
      figure.style.width = width + 'px';
      figure.style.height = height + 'px';

      // Replace image with figure and move image inside
      imgElement.replaceWith(figure);
      figure.appendChild(imgElement);
    }

    const overlay = new ImageUploadOverlay(figure, () => this.uploadImage(imgElement));
    overlay.setState('loading');

    try {
      const src = imgElement.getAttribute('src');
      if (!src) throw new Error('No src attribute found');

      // Extract the actual system path from an app:// URL.
      // Remove 'app://<hash>/' prefix and everything after '?'
      const systemPath = decodeURIComponent(src.replace(/^app:\/\/[^/]+/, '').split('?')[0]);

      // Extract relative path
      const adapter = this.app.vault.adapter;
      // TODO: test on mobile
      const vaultPath = adapter instanceof FileSystemAdapter ? adapter.getBasePath() : null;
      const relativePath = systemPath.replace(vaultPath + '/', '');
      // Read in file
      const file = await this.app.vault.adapter.readBinary(relativePath);

      // Determine MIME type from the file extension
      const fileName = relativePath.split('/').pop();
      const mimeType = getMimeType(fileName);

      // Create File object
      const imageFile = new File([file], fileName, { type: mimeType });

      // Upload image to Matters server
      const { path, id } = await this.directUpload({
        file: imageFile,
        type: 'embed',
        entityType: 'draft',
        entityId: this.draftSettings.id,
      });

      // Update the img element with the new URL and data attribute
      imgElement.src = path;
      imgElement.setAttribute('data-asset-id', id);

      // Create an empty <figcaption>
      const caption = document.createElement('figcaption');
      figure.appendChild(caption);

      // Once new image is loaded, remove the fixed dimensions
      imgElement.onload = () => {
        figure.style.width = '';
        figure.style.height = '';
      };

      this.successCount++;
      overlay.destroy(); // Remove overlay on success
    } catch (error) {
      overlay.setState('error');
      this.failedCount++;
      console.error('Image upload failed:', error);
    }
  }

  // Direct upload implementation
  async directUpload({ file, type, entityType, entityId }) {
    // First, get upload URL
    const {
      directImageUpload: { uploadURL: url, path, id },
    } = await this.sendQuery<DirectImageUploadMutation, DirectImageUploadInput>(
      DIRECT_IMAGE_UPLOAD,
      {
        type,
        entityType,
        entityId,
        mime: file.type,
      }
    );

    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok || !res.headers.get('content-type')?.startsWith('application/json')) {
      throw new Error('directUpload error: non json response');
    }
    const resData = await res.json();
    if (resData?.success !== true) {
      // errors: Uploaded image must have image/jpeg, image/png, image/webp, image/gif or image/svg+xml content-type
      throw new Error(`directUpload error: ${resData?.errors?.[0]?.message || 'no success'}`);
    }

    // mark image as uploaded
    await this.sendQuery<DirectImageUploadMutation, DirectImageUploadInput>(DIRECT_IMAGE_UPLOAD, {
      type,
      entityType,
      entityId,
      draft: false,
      url: path,
    });

    return { path, id };
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

      // scroll to bottom if we're already near the bottom
      // to avoid content jump
      // const isNearBottom =
      //   modalContentEl.scrollHeight - modalContentEl.scrollTop - modalContentEl.clientHeight < 30;
      // if (isNearBottom) {
      //   requestAnimationFrame(() => {
      //     modalContentEl.scrollTop = modalContentEl.scrollHeight;
      //   });
      // }
    } else if (state === 'loading') {
      // loading
      button.setDisabled(true).setButtonText('').setIcon('loader-2').buttonEl.addClass('loading');
      button.buttonEl.style.minWidth = `72px`;
    }
  }) as ButtonUpdate;

// Helper to determine MIME type from filename
function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };
  return mimeTypes[ext] || 'image/jpeg';
}
