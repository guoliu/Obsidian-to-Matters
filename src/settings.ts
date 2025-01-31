export type PublisherEnvironment = "production" | "development";

export const SERVER_ENDPOINTS: Record<PublisherEnvironment, string> = {
  production: "https://server.matters.town/graphql",
  development: "https://server-develop.matters.town/graphql",
};

export const WEB_DOMAINS: Record<PublisherEnvironment, string> = {
  production: "https://matters.town",
  development: "https://web-develop.matters.town",
};

export interface PublisherSettings {
  accessToken: string;
  environment: PublisherEnvironment;
}

export const DEFAULT_SETTINGS: PublisherSettings = {
  accessToken: "",
  environment: "production",
};
