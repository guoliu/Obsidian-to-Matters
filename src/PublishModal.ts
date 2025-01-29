import { MarkdownRenderer, Modal, Notice, requestUrl, Setting } from "obsidian";
import Publisher from "../main";
import { SERVER_ENDPOINTS } from "./settings";
import { PutDraftInput, ArticleLicenseType } from "./generated/graphql";

interface Draft {
	[key: string]: any;
}

export class PublishModal extends Modal {
	constructor(private plugin: Publisher) {
		super(plugin.app);
	}

	// send query to GQL server
	private async sendQuery(
		query: string,
		input: Record<string, unknown> = {}
	) {
		try {
			const response = await requestUrl({
				url: SERVER_ENDPOINTS[this.plugin.settings.environment],
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-access-token": this.plugin.settings.accessToken,
				},
				body: JSON.stringify({
					query,
					variables: { input },
				}),
			});
			if (response.status !== 200) {
				throw new Error(
					`Request failed with status ${response.status}`
				);
			}

			return response.json;
		} catch (error) {
			console.error("Full error details:", error);
			throw error;
		}
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
	private async getTitleFromUrl(url: string): Promise<string | null> {
		if (!url.includes("matters.town")) {
			console.error("Only accept URL of Matters article");
			return null;
		}

		const shortHash = url.split("/a/")[1].split("?")[0];

		try {
			const data = await this.sendQuery(`
				query GetArticle {
					article(input: { shortHash: "${shortHash}" }) {
						id
					    title
					}
				}
			`);

			return data.data.article.title;
		} catch (error) {
			console.error("Failed to fetch article title:", error);
			return null;
		}
	}

	async onOpen() {
		// get current open file and render content
		// verify that a file is open
		const currentFile = this.app.workspace.getActiveFile();
		if (!currentFile) {
			new Notice("No file is currently open");
			return;
		}

		// Verify the token is valid
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
		const cache = this.app.metadataCache.getFileCache(currentFile);

		// extract properties from metadata
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
					el.createDiv().innerHTML = `<b>Tags:</b> ${
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
				})
			)
			.addButton((btn) => {
				const btnEl = btn
					.setButtonText("Upload as draft")
					.setCta()
					.onClick(async () => {
						const originalContent = btnEl.buttonEl.innerHTML;
						const originalWidth = btnEl.buttonEl.offsetWidth;
						btnEl.buttonEl.style.minWidth = `${originalWidth}px`;
						btnEl
							.setButtonText("")
							.setIcon("loader-2")
							.buttonEl.addClass("loading");
						btnEl.setDisabled(true);

						try {
							await this.onSubmit();
						} finally {
							btnEl.buttonEl.removeClass("loading");
							btnEl.buttonEl.innerHTML = originalContent;
							btnEl.buttonEl.style.minWidth = "";
							btnEl.setDisabled(false);
						}
					});
				return btnEl;
			});

		// Fetch and update titles asynchronously
		this.draft["collection"].forEach(async (url: string, index: number) => {
			const title = await this.getTitleFromUrl(url);
			const linkEl = this.contentEl.querySelector(`#collection-${index}`);
			if (linkEl) {
				linkEl.textContent = title;
			}
		});
	}

	private async onSubmit() {
		try {
			// deconstruct draft, get license and allowComments
			const {
				license: licenseString,
				allowComments,
				collection: _, // TODO: support collection
				...rest
			} = this.draft;

			// translate license to Matters API, using CC0 as default
			const licenseKey = licenseString.replace(/\s+/g, "").toLowerCase();
			const license = (
				licenseKey in this.licenseMap
					? this.licenseMap[licenseKey]
					: "cc_0"
			) as ArticleLicenseType;

			const data = await this.sendQuery(
				`
				mutation PutDraft($input: PutDraftInput!) {
					putDraft(input: $input) {
						id
						title
						content
						slug
					}
				}
			`,
				{
					...rest,
					license,
					canComment: allowComments,
				} satisfies PutDraftInput
			);

			if (data.errors) {
				throw new Error(data.errors[0].message);
			}

			new Notice(`Successfully published draft.`);
		} catch (error) {
			console.error("Failed to publish to Matters Town:", error);
			new Notice("Failed to publish to Matters Town: " + error.message);
		}
	}

	private async verifyToken(): Promise<boolean> {
		try {
			const data = await this.sendQuery(`
						query Me {
							viewer {
								id
								userName
							}
						}
					`);
			return !data.errors && data.data?.viewer?.id;
		} catch (error) {
			console.error("Token verification failed:", error);
			new Notice(
				"Token verification failed. Please check your access token."
			);
			return false;
		}
	}
}
