import { Plugin, Setting, App, PluginSettingTab, Notice } from 'obsidian';
import { type PublisherSettings, DEFAULT_SETTINGS } from './src/settings';
import { PublishModal } from './src/PublishModal';
import { translations } from './src/translations';

export default class Publisher extends Plugin {
  iconEl!: HTMLElement;
  settings: PublisherSettings;

  private updateIconVisibility() {
    const activeFile = this.app.workspace.getActiveFile();
    activeFile ? (this.iconEl.style.display = 'block') : (this.iconEl.style.display = 'none');
  }

  async onload() {
    await this.loadSettings();

    this.iconEl = this.addRibbonIcon(
      'send',
      translations().publishToMatters,
      async (evt: MouseEvent) => {
        // check frontmatter
        const activeFile = this.app.workspace.getActiveFile();

        if (!activeFile) {
          new Notice(translations().notices.noActiveFile);
          return;
        }

        const modal = new PublishModal(this);

        let modified = false;
        await this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
          for (const property in translations().frontmatter) {
            if (!(translations().frontmatter[property] in frontmatter)) {
              frontmatter[translations().frontmatter[property]] = modal.draft.settings[property];
              modified = true;
            }
          }
        });
        if (modified) {
          new Notice(translations().notices.addedFrontmatter);
        } else {
          modal.open();
        }
      }
    );

    // Only show the icon when there is a active file to be published
    this.updateIconVisibility();

    // Listen to active leaf changes and update icon visibility
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => {
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
  lang: string;

  constructor(app: App, plugin: Publisher) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: translations().settings.mattersSettings });

    new Setting(containerEl)
      .setName(translations().settings.accessToken)
      .setDesc(translations().settings.enterToken)
      .addText((text) =>
        text.setValue(this.plugin.settings.accessToken).onChange(async (value) => {
          this.plugin.settings.accessToken = value;
          await this.plugin.saveSettings();
        })
      );
  }
}
