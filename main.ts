import { Plugin, Setting, App, PluginSettingTab } from "obsidian";
import { PublisherSettings, DEFAULT_SETTINGS } from "./src/settings";
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

		this.iconEl = this.addRibbonIcon("dice", "Post", (evt: MouseEvent) => {
			const modal = new PublishModal(this);
			modal.open();
		});

		// Only show the icon when there is a active file to be published
		this.updateIconVisibility();

		// Listen to active leaf changes and update icon visibility
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				this.updateIconVisibility();
			})
		);

		this.addCommand({
			id: "publish-to-matters",
			name: "Publish to Matters Town",
			callback: () => {
				new PublishModal(this).open();
			},
		});

		this.addSettingTab(new PublisherSettingTab(this.app, this));
	}

	onunload() {
		this.iconEl.remove();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
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
