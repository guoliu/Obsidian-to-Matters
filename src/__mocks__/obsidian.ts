// Basic Modal class that we extend
export class Modal {
  app: App;
  containerEl: HTMLElement;

  constructor(app: App) {
    this.app = app;
    this.containerEl = document.createElement("div");
  }

  open() {}
  close() {}
}

// Notice for user notifications
export class Notice {
  constructor(message: string, timeout?: number) {}
}

// Mock App interface
export interface App {
  workspace: Workspace;
  vault: Vault;
}

// Mock Workspace
export interface Workspace {
  getActiveFile(): TFile | null;
}

// Mock Vault
export interface Vault {
  read(file: TFile): Promise<string>;
}

// Mock TFile
export interface TFile {
  path: string;
  name: string;
  basename: string;
}

// Mock requestUrl for API calls
export const requestUrl = async (options: {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}): Promise<{
  json: any;
  status: number;
  headers: Record<string, string>;
}> => {
  // Default mock response
  return {
    json: { data: {} },
    status: 200,
    headers: {},
  };
};

// Mock other utilities we use
export const normalizePath = (path: string): string => path;
export const setIcon = (el: HTMLElement, icon: string): void => {};

// Mock MarkdownRenderer
export const MarkdownRenderer = {
  render: async (
    app: App,
    markdown: string,
    el: HTMLElement,
    sourcePath: string,
    component: any
  ): Promise<void> => {
    el.innerHTML = markdown;
  },
};
