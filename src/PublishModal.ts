import {
  ButtonComponent,
  MarkdownRenderer,
  Notice,
  setIcon,
  Setting,
} from "obsidian";

import Publisher from "../main";
import { WEB_DOMAINS } from "./settings";
import { QueryModal } from "./QueryModal";
import { GET_ARTICLE, ME, PUBLISH_ARTICLE, PUT_DRAFT } from "./operations";

import {
  PutDraftInput,
  ArticleLicenseType,
  PutDraftMutation,
  PublishArticleInput,
  GetArticleQuery,
  ArticleInput,
  PublishArticleMutation,
  MeQuery,
} from "./generated/graphql";

interface Draft {
  [key: string]: any;
}

export class PublishModal extends QueryModal {
  button: ButtonComponent;
  description: DocumentFragment;

  constructor(plugin: Publisher) {
    super(plugin);
  }

  // metadata of article, as seen in Obsidian editor
  private draft: Draft = {
    title: "",
    collection: [],
    tags: [],
    license: "",
    allowComments: false,
    summary: "",
    content: "",
  };

  // map of readable license to Matters API license
  private licenseMap: Record<string, string> = {
    cc0: "cc_0",
    ccbyncnd2: "cc_by_nc_nd_2",
    ccbyncnd4: "cc_by_nc_nd_4",
    allrightsreserved: "arr",
  };

  // get Matters article info from url
  private async getArticleFromUrl(url: string) {
    if (!url.includes("matters.town")) {
      console.error("Only accept URL of Matters article");
      return null;
    }

    const shortHash = url.split("/a/")[1].split("?")[0];

    try {
      const data = await this.sendQuery<GetArticleQuery, ArticleInput>(
        GET_ARTICLE,
        { shortHash }
      );

      return data.article;
    } catch (error) {
      console.error("Failed to fetch article title:", error);
      return null;
    }
  }

  async onOpen() {
    // Add loading spinner
    const loadingEl = this.contentEl.createDiv({ cls: "loader-container" });
    loadingEl.addClass("loading");
    setIcon(loadingEl, "loader-circle");

    try {
      // checks
      const currentFile = this.app.workspace.getActiveFile();
      if (!currentFile) {
        new Notice("No file is currently open");
        return;
      }

      const isValid = await this.verifyToken();
      if (!isValid) {
        new Notice(
          "Invalid or expired access token. Please update in settings."
        );
        return;
      }

      // get and set title
      const title = currentFile.basename;
      this.setTitle(title);

      // get md content
      const md = await this.app.vault.read(currentFile);
      // render html into contentEl
      await MarkdownRenderer.render(
        this.app,
        md,
        this.contentEl,
        currentFile.path,
        this.plugin
      );

      // read in data for draft
      this.draft.title = title;
      this.draft.content = this.contentEl.innerHTML;

      console.log(this.draft.content);

      // remove loading spinner
      loadingEl.remove();

      // extract properties from metadata
      const cache = this.app.metadataCache.getFileCache(currentFile);
      for (const key in this.draft) {
        const property =
          cache?.frontmatter?.[
            key.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()
          ];
        if (property) {
          this.draft[key] = property;
        }
      }

      // display tags and collection
      new Setting(this.contentEl)
        .setDesc(
          createFragment((el) => {
            el.createDiv().innerHTML = `
            <b>Tags:</b> ${
              this.draft["tags"].length > 0
                ? this.draft["tags"].join(", ")
                : "No tags"
            }<br>
						<b>Collection:</b> ${this.draft["collection"]
              .map(
                (url: string, index: number) =>
                  `<a id="collection-${index}" href="${url}" target="_blank">${url}</a>`
              )
              .join(", ")}`;

            this.description = el;
          })
        )
        .addButton((btn) => {
          // register button
          const button = btn
            .setButtonText("Upload draft")
            .setCta()
            .onClick(this.onSubmit.bind(this));

          // prevent resizing
          button.buttonEl.style.minWidth = `${button.buttonEl.offsetWidth}px`;

          // register button
          this.button = button;

          return button;
        });

      // Fetch and update collection
      const collection: string[] = [];
      this.draft["collection"].forEach(async (url: string, index: number) => {
        const article = await this.getArticleFromUrl(url);
        if (article) {
          // get id
          collection.push(article.id);
          // display title
          const linkEl = this.contentEl.querySelector(`#collection-${index}`);
          if (linkEl) {
            linkEl.textContent = article.title;
          }
        } else {
          new Notice(`Failed to fetch article: ${url}`);
        }
      });
      this.draft.collection = collection;
    } catch (error) {
      new Notice("Failed to load article data: " + error.message);
      console.error(error);
    }
  }

  private async uploadDraft() {
    // show spinner
    this.button
      .setButtonText("")
      .setIcon("loader-circle")
      .buttonEl.addClass("loading");
    this.button.setDisabled(true);

    try {
      // deconstruct draft, get license and allowComments
      const { license: licenseString, allowComments, ...rest } = this.draft;

      // translate license to Matters API, using CC0 as default
      const licenseKey = licenseString.replace(/\s+/g, "").toLowerCase();
      const license = (
        licenseKey in this.licenseMap ? this.licenseMap[licenseKey] : "cc_0"
      ) as ArticleLicenseType;

      const data = await this.sendQuery<PutDraftMutation, PutDraftInput>(
        PUT_DRAFT,
        {
          ...rest,
          license,
          canComment: allowComments,
        }
      );

      new Notice(` Draft uploaded.`);

      // get server version of draft
      this.draft = { ...this.draft, ...data.putDraft };
      // display draft url
      const draftURL = `${WEB_DOMAINS[this.plugin.settings.environment]}/me/drafts/${this.draft.id}`;
      console.log({ draftURL });

      // remove loader
      this.button.buttonEl.removeClass("loading");
      this.button.setDisabled(false);
      this.button.setButtonText("Publish draft");
    } catch (error) {
      console.error("Failed to upload draft:", error);
      new Notice("Failed to upload draft:" + error.message);
    }
  }

  private async publishArticle() {
    try {
      // show spinner
      this.button
        .setButtonText("")
        .setIcon("loader-2")
        .buttonEl.addClass("loading");
      this.button.setDisabled(true);

      // trigger publish
      const data = await this.sendQuery<
        PublishArticleMutation,
        PublishArticleInput
      >(PUBLISH_ARTICLE, {
        id: this.draft.id,
      });

      console.log(data);
    } catch (error) {
      console.error("Failed to publish draft:", error);
      new Notice("Failed to publish draft:" + error.message);
    }

    // const url = data.
  }

  private async onSubmit() {
    if (!this.draft.id) {
      await this.uploadDraft();
    } else {
      await this.publishArticle();
    }
  }

  private async verifyToken(): Promise<boolean> {
    try {
      const data = await this.sendQuery<MeQuery>(ME);
      return !!data?.viewer?.id;
    } catch (error) {
      console.error("Token verification failed:", error);
      new Notice("Token verification failed. Please check your access token.");
      return false;
    }
  }
}
