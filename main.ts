import { Plugin, Setting, App, PluginSettingTab, Notice } from "obsidian";
import { type PublisherSettings, DEFAULT_SETTINGS } from "./src/settings";
import { PublishModal } from "./src/PublishModal";

export default class Publisher extends Plugin {
  private iconEl!: HTMLElement;
  settings: PublisherSettings;

  private updateIconVisibility() {
    const activeFile = this.app.workspace.getActiveFile();
    activeFile
      ? (this.iconEl.style.display = "block")
      : (this.iconEl.style.display = "none");
  }

  async onload() {
    await this.loadSettings();

    this.iconEl = this.addRibbonIcon(
      "dice",
      "Post",
      async (evt: MouseEvent) => {
        // check frontmatter
        const activeFile = this.app.workspace.getActiveFile();

        if (!activeFile) {
          new Notice("No active file.");
          return;
        }

        const modal = new PublishModal(this);

        let modified = false;
        await this.app.fileManager.processFrontMatter(
          activeFile,
          (frontmatter) => {
            for (const property in modal.draft.settings) {
              if (!(property in frontmatter)) {
                frontmatter[property] =
                  modal.draft.settings[
                    property as keyof typeof modal.draft.settings
                  ];
                modified = true;
              }
            }
          }
        );
        if (modified) {
          new Notice("Article settings added. Click again to upload.");
        } else {
          modal.open();
        }
      }
    );

    // Only show the icon when there is a active file to be published
    this.updateIconVisibility();

    // Listen to active leaf changes and update icon visibility
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        this.updateIconVisibility();
      })
    );

    this.addSettingTab(new PublisherSettingTab(this.app, this));
  }

  onunload() {
    this.iconEl.remove();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class PublisherSettingTab extends PluginSettingTab {
  plugin: Publisher;

  constructor(app: App, plugin: Publisher) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Matters Town Settings" });

    new Setting(containerEl)
      .setName("Access Token")
      .setDesc("Enter your Matters Town access token")
      .addText((text) =>
        text
          .setPlaceholder("Enter your token")
          .setValue(this.plugin.settings.accessToken)
          .onChange(async (value) => {
            this.plugin.settings.accessToken = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
