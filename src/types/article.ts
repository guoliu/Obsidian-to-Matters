/**
 * Enums for article license types.
 */
export type ArticleLicenseType = 'cc_0' | 'cc_by_nc_nd_2' | 'cc_by_nc_nd_4' | 'arr';

/**
 * Settings for a draft article
 */
export interface DraftSettings {
  id?: string;
  summary?: string | null;
  tags: string[];
  collection: { url: string; id?: string; title?: string }[];
  license: string;
  allowComments: boolean;
}

export interface ArticleMetadata {
  title: string;
  content: string;
  collection?: string[];
  license?: ArticleLicenseType;
  canComment?: boolean;
}

// Add validation helper
export function isValidLicense(license: string): license is ArticleLicenseType {
  return ['cc_0', 'cc_by_nc_nd_2', 'cc_by_nc_nd_4', 'arr'].includes(license);
}
