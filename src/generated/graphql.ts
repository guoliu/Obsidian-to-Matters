export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  Upload: { input: any; output: any };
  amount_Float_NotNull_exclusiveMin_0: { input: any; output: any };
  amount_Float_exclusiveMin_0: { input: any; output: any };
  amount_Int_NotNull_min_1: { input: any; output: any };
  banDays_Int_exclusiveMin_0: { input: any; output: any };
  boost_Float_NotNull_min_0: { input: any; output: any };
  description_String_maxLength_140: { input: any; output: any };
  email_String_NotNull_format_email: { input: any; output: any };
  email_String_format_email: { input: any; output: any };
  first_Int_min_0: { input: any; output: any };
  freePeriod_Int_NotNull_exclusiveMin_0: { input: any; output: any };
  last_Int_min_0: { input: any; output: any };
  link_String_NotNull_format_uri: { input: any; output: any };
  link_String_format_uri: { input: any; output: any };
  random_Int_min_0_max_49: { input: any; output: any };
  redirectUrl_String_format_uri: { input: any; output: any };
  replyToDonator_String_maxLength_140: { input: any; output: any };
  requestForDonation_String_maxLength_140: { input: any; output: any };
  url_String_format_uri: { input: any; output: any };
  website_String_format_uri: { input: any; output: any };
};

export type AddCollectionsArticlesInput = {
  articles: Array<Scalars["ID"]["input"]>;
  collections: Array<Scalars["ID"]["input"]>;
};

export type AddCreditInput = {
  amount: Scalars["amount_Float_NotNull_exclusiveMin_0"]["input"];
};

export type AnnouncementType = "community" | "product" | "seminar";

export type AnnouncementsInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  visible?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ApplyCampaignInput = {
  id: Scalars["ID"]["input"];
};

export type AppreciateArticleInput = {
  amount: Scalars["amount_Int_NotNull_min_1"]["input"];
  id: Scalars["ID"]["input"];
  superLike?: InputMaybe<Scalars["Boolean"]["input"]>;
  token?: InputMaybe<Scalars["String"]["input"]>;
};

export type AppreciationPurpose =
  | "appreciate"
  | "appreciateComment"
  | "appreciateSubsidy"
  | "firstPost"
  | "invitationAccepted"
  | "joinByInvitation"
  | "joinByTask"
  | "systemSubsidy";

/** Enums for types of article access */
export type ArticleAccessType = "paywall" | "public";

export type ArticleArticleNoticeType = "ArticleNewCollected";

export type ArticleCampaignInput = {
  campaign: Scalars["ID"]["input"];
  stage?: InputMaybe<Scalars["ID"]["input"]>;
};

export type ArticleInput = {
  mediaHash?: InputMaybe<Scalars["String"]["input"]>;
  shortHash?: InputMaybe<Scalars["String"]["input"]>;
};

/** Enums for types of article license */
export type ArticleLicenseType =
  | "arr"
  | "cc_0"
  | "cc_by_nc_nd_2"
  | "cc_by_nc_nd_4";

export type ArticleNoticeType =
  | "ArticleMentionedYou"
  | "ArticleNewAppreciation"
  | "ArticleNewSubscriber"
  | "ArticlePublished"
  | "CircleNewArticle"
  | "RevisedArticleNotPublished"
  | "RevisedArticlePublished";

export type ArticleRecommendationActivitySource =
  | "ReadArticlesTags"
  | "UserDonation";

/** Enums for an article state. */
export type ArticleState = "active" | "archived" | "banned";

export type ArticleVersionsInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
};

/** Enums for asset types. */
export type AssetType =
  | "announcementCover"
  | "avatar"
  | "campaignCover"
  | "circleAvatar"
  | "circleCover"
  | "collectionCover"
  | "cover"
  | "embed"
  | "embedaudio"
  | "moment"
  | "oauthClientAvatar"
  | "profileCover"
  | "tagCover";

export type AuthResultType = "LinkAccount" | "Login" | "Signup";

export type AuthorsType = "active" | "appreciated" | "default" | "trendy";

export type BadgeType =
  | "architect"
  | "golden_motor"
  | "grand_slam"
  | "nomad1"
  | "nomad2"
  | "nomad3"
  | "nomad4"
  | "seed";

export type BadgedUsersInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  type?: InputMaybe<BadgeType>;
};

export type BoostTypes = "Article" | "Campaign" | "Tag" | "User";

export type CacheControlScope = "PRIVATE" | "PUBLIC";

export type CampaignApplicationState = "pending" | "rejected" | "succeeded";

export type CampaignArticleNoticeType = "CampaignArticleFeatured";

export type CampaignArticlesFilter = {
  featured?: InputMaybe<Scalars["Boolean"]["input"]>;
  stage?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CampaignArticlesInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<CampaignArticlesFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
};

export type CampaignInput = {
  shortHash: Scalars["String"]["input"];
};

export type CampaignParticipantsInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  /** return all state participants */
  oss?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type CampaignStageInput = {
  description?: InputMaybe<Array<TranslationInput>>;
  name: Array<TranslationInput>;
  period?: InputMaybe<DatetimeRangeInput>;
};

export type CampaignState = "active" | "archived" | "finished" | "pending";

export type CampaignsInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  /** return pending and archived campaigns */
  oss?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type Chain = "Optimism" | "Polygon";

export type ChannelArticlesInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  channelId: Scalars["ID"]["input"];
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
};

export type CircleInput = {
  /** Slugified name of a Circle. */
  name: Scalars["String"]["input"];
};

export type CircleNoticeType =
  | "CircleInvitation"
  | "CircleNewBroadcastComments"
  | "CircleNewDiscussionComments"
  | "CircleNewFollower"
  | "CircleNewSubscriber"
  | "CircleNewUnsubscriber";

export type CircleRecommendationActivitySource = "UserSubscription";

export type CircleState = "active" | "archived";

export type ClaimLogbooksInput = {
  ethAddress: Scalars["String"]["input"];
  /** nonce from generateSigningMessage */
  nonce: Scalars["String"]["input"];
  /** sign'ed by wallet */
  signature: Scalars["String"]["input"];
  /** the message being sign'ed, including nonce */
  signedMessage: Scalars["String"]["input"];
};

export type ClassifyArticlesChannelsInput = {
  ids: Array<Scalars["ID"]["input"]>;
};

export type ClearReadHistoryInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CollectionArticlesInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  includeAfter?: Scalars["Boolean"]["input"];
  includeBefore?: Scalars["Boolean"]["input"];
  last?: InputMaybe<Scalars["last_Int_min_0"]["input"]>;
  reversed?: Scalars["Boolean"]["input"];
};

export type CommentCommentNoticeType = "CommentNewReply";

export type CommentCommentsInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  author?: InputMaybe<Scalars["ID"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  sort?: InputMaybe<CommentSort>;
};

export type CommentInput = {
  articleId?: InputMaybe<Scalars["ID"]["input"]>;
  circleId?: InputMaybe<Scalars["ID"]["input"]>;
  content: Scalars["String"]["input"];
  mentions?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  momentId?: InputMaybe<Scalars["ID"]["input"]>;
  parentId?: InputMaybe<Scalars["ID"]["input"]>;
  replyTo?: InputMaybe<Scalars["ID"]["input"]>;
  type: CommentType;
};

export type CommentNoticeType =
  | "ArticleNewComment"
  | "CircleNewBroadcast"
  | "CommentLiked"
  | "CommentMentionedYou"
  | "CommentPinned"
  | "MomentNewComment"
  | "SubscribedArticleNewComment";

/** Enums for sorting comments by time. */
export type CommentSort = "newest" | "oldest";

/** Enums for comment state. */
export type CommentState = "active" | "archived" | "banned" | "collapsed";

export type CommentType =
  | "article"
  | "circleBroadcast"
  | "circleDiscussion"
  | "moment";

export type CommentsFilter = {
  author?: InputMaybe<Scalars["ID"]["input"]>;
  parentComment?: InputMaybe<Scalars["ID"]["input"]>;
  state?: InputMaybe<CommentState>;
};

export type CommentsInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<CommentsFilter>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  includeAfter?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeBefore?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<CommentSort>;
};

export type ConfirmVerificationCodeInput = {
  code: Scalars["String"]["input"];
  email: Scalars["email_String_NotNull_format_email"]["input"];
  type: VerificationCodeType;
};

export type ConnectStripeAccountInput = {
  country: StripeAccountCountry;
};

export type ConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<FilterInput>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  oss?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type CryptoWalletSignaturePurpose =
  | "airdrop"
  | "connect"
  | "login"
  | "signup";

export type DatetimeRangeInput = {
  end?: InputMaybe<Scalars["DateTime"]["input"]>;
  start: Scalars["DateTime"]["input"];
};

export type DeleteAnnouncementsInput = {
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type DeleteCollectionArticlesInput = {
  articles: Array<Scalars["ID"]["input"]>;
  collection: Scalars["ID"]["input"];
};

export type DeleteCollectionsInput = {
  ids: Array<Scalars["ID"]["input"]>;
};

export type DeleteCommentInput = {
  id: Scalars["ID"]["input"];
};

export type DeleteDraftInput = {
  id: Scalars["ID"]["input"];
};

export type DeleteMomentInput = {
  id: Scalars["ID"]["input"];
};

export type DeleteTagsInput = {
  ids: Array<Scalars["ID"]["input"]>;
};

export type DirectImageUploadInput = {
  draft?: InputMaybe<Scalars["Boolean"]["input"]>;
  entityId?: InputMaybe<Scalars["ID"]["input"]>;
  entityType: EntityType;
  mime?: InputMaybe<Scalars["String"]["input"]>;
  type: AssetType;
  url?: InputMaybe<Scalars["url_String_format_uri"]["input"]>;
};

export type EditArticleInput = {
  accessType?: InputMaybe<ArticleAccessType>;
  /** which campaigns to attach */
  campaigns?: InputMaybe<Array<ArticleCampaignInput>>;
  /** whether readers can comment */
  canComment?: InputMaybe<Scalars["Boolean"]["input"]>;
  circle?: InputMaybe<Scalars["ID"]["input"]>;
  collection?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  content?: InputMaybe<Scalars["String"]["input"]>;
  cover?: InputMaybe<Scalars["ID"]["input"]>;
  /** revision description */
  description?: InputMaybe<
    Scalars["description_String_maxLength_140"]["input"]
  >;
  id: Scalars["ID"]["input"];
  indentFirstLine?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** whether publish to ISCN */
  iscnPublish?: InputMaybe<Scalars["Boolean"]["input"]>;
  license?: InputMaybe<ArticleLicenseType>;
  pinned?: InputMaybe<Scalars["Boolean"]["input"]>;
  replyToDonator?: InputMaybe<
    Scalars["replyToDonator_String_maxLength_140"]["input"]
  >;
  requestForDonation?: InputMaybe<
    Scalars["requestForDonation_String_maxLength_140"]["input"]
  >;
  sensitive?: InputMaybe<Scalars["Boolean"]["input"]>;
  state?: InputMaybe<ArticleState>;
  summary?: InputMaybe<Scalars["String"]["input"]>;
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type EmailLoginInput = {
  email: Scalars["String"]["input"];
  /** used in register */
  language?: InputMaybe<UserLanguage>;
  passwordOrCode: Scalars["String"]["input"];
  referralCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type EntityType =
  | "announcement"
  | "article"
  | "campaign"
  | "circle"
  | "collection"
  | "draft"
  | "moment"
  | "tag"
  | "user";

export type ExchangeRatesInput = {
  from?: InputMaybe<TransactionCurrency>;
  to?: InputMaybe<QuoteCurrency>;
};

export type FeatureFlag = "admin" | "off" | "on" | "seeding";

export type FeatureName =
  | "add_credit"
  | "article_channel"
  | "circle_interact"
  | "circle_management"
  | "fingerprint"
  | "payment"
  | "payout"
  | "spam_detection"
  | "tag_adoption"
  | "verify_appreciate";

export type FeaturedCommentsInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  sort?: InputMaybe<CommentSort>;
};

export type FeaturedTagsInput = {
  /**  tagIds  */
  ids: Array<Scalars["ID"]["input"]>;
};

export type FilterInput = {
  /** Used in RecommendInput */
  followed?: InputMaybe<Scalars["Boolean"]["input"]>;
  inRangeEnd?: InputMaybe<Scalars["DateTime"]["input"]>;
  inRangeStart?: InputMaybe<Scalars["DateTime"]["input"]>;
  /** index of list, min: 0, max: 49 */
  random?: InputMaybe<Scalars["random_Int_min_0_max_49"]["input"]>;
  /** Used in User Articles filter, by tags or by time range, or both */
  tagIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type FrequentSearchInput = {
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  key?: InputMaybe<Scalars["String"]["input"]>;
};

export type GenerateSigningMessageInput = {
  address: Scalars["String"]["input"];
  purpose?: InputMaybe<SigningMessagePurpose>;
};

export type GrantType = "authorization_code" | "refresh_token";

export type IcymiTopicState = "archived" | "editing" | "published";

export type InvitationState =
  | "accepted"
  | "pending"
  | "transfer_failed"
  | "transfer_succeeded";

export type InviteCircleInput = {
  circleId: Scalars["ID"]["input"];
  freePeriod: Scalars["freePeriod_Int_NotNull_exclusiveMin_0"]["input"];
  invitees: Array<InviteCircleInvitee>;
};

export type InviteCircleInvitee = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type KeywordInput = {
  keyword: Scalars["String"]["input"];
};

export type KeywordsInput = {
  keywords?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type LikeCollectionInput = {
  id: Scalars["ID"]["input"];
};

export type LikeMomentInput = {
  id: Scalars["ID"]["input"];
};

export type LogRecordInput = {
  type: LogRecordTypes;
};

export type LogRecordTypes =
  | "ReadFolloweeArticles"
  | "ReadFollowingFeed"
  | "ReadResponseInfoPopUp";

export type MergeTagsInput = {
  content: Scalars["String"]["input"];
  ids: Array<Scalars["ID"]["input"]>;
};

export type MigrationInput = {
  files: Array<InputMaybe<Scalars["Upload"]["input"]>>;
  type?: InputMaybe<MigrationType>;
};

export type MigrationType = "medium";

export type MomentInput = {
  shortHash: Scalars["String"]["input"];
};

export type MomentNoticeType = "MomentLiked" | "MomentMentionedYou";

export type MomentState = "active" | "archived";

export type NodeInput = {
  id: Scalars["ID"]["input"];
};

export type NodesInput = {
  ids: Array<Scalars["ID"]["input"]>;
};

export type NotificationSettingType =
  | "articleNewAppreciation"
  | "articleNewCollected"
  | "articleNewComment"
  | "articleNewSubscription"
  | "circleMemberBroadcast"
  | "circleMemberNewBroadcastReply"
  | "circleMemberNewDiscussion"
  | "circleMemberNewDiscussionReply"
  | "circleNewDiscussion"
  | "circleNewFollower"
  /** for circle owners */
  | "circleNewSubscriber"
  | "circleNewUnsubscriber"
  | "email"
  /** for circle members */
  | "inCircleNewArticle"
  | "inCircleNewBroadcast"
  | "inCircleNewBroadcastReply"
  | "inCircleNewDiscussion"
  | "inCircleNewDiscussionReply"
  | "mention"
  | "newComment"
  | "newLike"
  | "userNewFollower";

export type OAuthClientInput = {
  id: Scalars["ID"]["input"];
};

export type OssArticlesFilterInput = {
  isSpam?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type OssArticlesInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OssArticlesFilterInput>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
};

export type Oauth1CredentialInput = {
  oauthToken: Scalars["String"]["input"];
  oauthVerifier: Scalars["String"]["input"];
};

export type PayToInput = {
  amount: Scalars["amount_Float_NotNull_exclusiveMin_0"]["input"];
  /** for ERC20/native token payment */
  chain?: InputMaybe<Chain>;
  currency: TransactionCurrency;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  /** for HKD payment */
  password?: InputMaybe<Scalars["String"]["input"]>;
  purpose: TransactionPurpose;
  recipientId: Scalars["ID"]["input"];
  targetId?: InputMaybe<Scalars["ID"]["input"]>;
  txHash?: InputMaybe<Scalars["String"]["input"]>;
};

export type PayoutInput = {
  amount: Scalars["amount_Float_NotNull_exclusiveMin_0"]["input"];
  password: Scalars["String"]["input"];
};

export type PinCommentInput = {
  id: Scalars["ID"]["input"];
};

export type PriceState = "active" | "archived";

export type PublishArticleInput = {
  id: Scalars["ID"]["input"];
  /** whether publish to ISCN */
  iscnPublish?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Enums for publishing state. */
export type PublishState = "error" | "pending" | "published" | "unpublished";

export type PutAnnouncementInput = {
  content?: InputMaybe<Scalars["String"]["input"]>;
  cover?: InputMaybe<Scalars["String"]["input"]>;
  expiredAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  link?: InputMaybe<Scalars["link_String_format_uri"]["input"]>;
  order?: InputMaybe<Scalars["Int"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  translations?: InputMaybe<Array<TranslatedAnnouncementInput>>;
  type?: InputMaybe<AnnouncementType>;
  visible?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type PutChannelInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  name?: InputMaybe<Array<TranslationInput>>;
  providerId: Scalars["String"]["input"];
};

export type PutCircleArticlesInput = {
  /** Access Type, `public` or `paywall` only. */
  accessType: ArticleAccessType;
  /** Article Ids */
  articles?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  /** Circle ID */
  id: Scalars["ID"]["input"];
  license?: InputMaybe<ArticleLicenseType>;
  /** Action Type */
  type: PutCircleArticlesType;
};

export type PutCircleArticlesType = "add" | "remove";

export type PutCircleInput = {
  /** Circle's subscription fee. */
  amount?: InputMaybe<Scalars["amount_Float_exclusiveMin_0"]["input"]>;
  /** Unique ID of a Circle's avatar. */
  avatar?: InputMaybe<Scalars["ID"]["input"]>;
  /** Unique ID of a Circle's cover. */
  cover?: InputMaybe<Scalars["ID"]["input"]>;
  /** A short description of this Circle. */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Human readable name of this Circle. */
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique ID. */
  id?: InputMaybe<Scalars["ID"]["input"]>;
  /** Slugified name of a Circle. */
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type PutCollectionInput = {
  cover?: InputMaybe<Scalars["ID"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  pinned?: InputMaybe<Scalars["Boolean"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type PutCommentInput = {
  comment: CommentInput;
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type PutDraftInput = {
  accessType?: InputMaybe<ArticleAccessType>;
  /** which campaigns to attach */
  campaigns?: InputMaybe<Array<ArticleCampaignInput>>;
  /** whether readers can comment */
  canComment?: InputMaybe<Scalars["Boolean"]["input"]>;
  circle?: InputMaybe<Scalars["ID"]["input"]>;
  collection?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  content?: InputMaybe<Scalars["String"]["input"]>;
  cover?: InputMaybe<Scalars["ID"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  indentFirstLine?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** whether publish to ISCN */
  iscnPublish?: InputMaybe<Scalars["Boolean"]["input"]>;
  license?: InputMaybe<ArticleLicenseType>;
  replyToDonator?: InputMaybe<
    Scalars["replyToDonator_String_maxLength_140"]["input"]
  >;
  requestForDonation?: InputMaybe<
    Scalars["requestForDonation_String_maxLength_140"]["input"]
  >;
  sensitive?: InputMaybe<Scalars["Boolean"]["input"]>;
  summary?: InputMaybe<Scalars["String"]["input"]>;
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type PutIcymiTopicInput = {
  articles?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  note?: InputMaybe<Scalars["String"]["input"]>;
  pinAmount?: InputMaybe<Scalars["Int"]["input"]>;
  state?: InputMaybe<IcymiTopicState>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type PutMomentInput = {
  assets: Array<Scalars["ID"]["input"]>;
  content: Scalars["String"]["input"];
};

export type PutOAuthClientInput = {
  avatar?: InputMaybe<Scalars["ID"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  grantTypes?: InputMaybe<Array<GrantType>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  redirectURIs?: InputMaybe<Array<Scalars["String"]["input"]>>;
  scope?: InputMaybe<Array<Scalars["String"]["input"]>>;
  secret?: InputMaybe<Scalars["String"]["input"]>;
  user?: InputMaybe<Scalars["ID"]["input"]>;
  website?: InputMaybe<Scalars["website_String_format_uri"]["input"]>;
};

export type PutRemarkInput = {
  id: Scalars["ID"]["input"];
  remark: Scalars["String"]["input"];
  type: RemarkTypes;
};

export type PutRestrictedUsersInput = {
  ids: Array<Scalars["ID"]["input"]>;
  restrictions: Array<UserRestrictionType>;
};

export type PutSkippedListItemInput = {
  archived?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  type?: InputMaybe<SkippedListItemType>;
  value?: InputMaybe<Scalars["String"]["input"]>;
};

export type PutUserFeatureFlagsInput = {
  flags: Array<UserFeatureFlagType>;
  ids: Array<Scalars["ID"]["input"]>;
};

export type PutWritingChallengeInput = {
  announcements?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  applicationPeriod?: InputMaybe<DatetimeRangeInput>;
  cover?: InputMaybe<Scalars["ID"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  link?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Array<TranslationInput>>;
  stages?: InputMaybe<Array<CampaignStageInput>>;
  state?: InputMaybe<CampaignState>;
  writingPeriod?: InputMaybe<DatetimeRangeInput>;
};

export type QuoteCurrency = "HKD" | "TWD" | "USD";

export type ReadArticleInput = {
  id: Scalars["ID"]["input"];
};

export type RecommendInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<FilterInput>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  oss?: InputMaybe<Scalars["Boolean"]["input"]>;
  type?: InputMaybe<AuthorsType>;
};

/** Enums for types of recommend articles. */
export type RecommendTypes = "hottest" | "icymi" | "newest" | "search";

export type RecommendationFollowingFilterInput = {
  type?: InputMaybe<RecommendationFollowingFilterType>;
};

export type RecommendationFollowingFilterType = "article";

export type RecommendationFollowingInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<RecommendationFollowingFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RefreshIpnsFeedInput = {
  /** refresh how many recent articles, default to 50 */
  numArticles?: InputMaybe<Scalars["Int"]["input"]>;
  userName: Scalars["String"]["input"];
};

export type RelatedDonationArticlesInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  oss?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** index of article list, min: 0, max: 49 */
  random?: InputMaybe<Scalars["random_Int_min_0_max_49"]["input"]>;
};

export type RemarkTypes =
  | "Article"
  | "Comment"
  | "Feedback"
  | "Report"
  | "Tag"
  | "User";

export type RemoveSocialLoginInput = {
  type: SocialAccountType;
};

export type RenameTagInput = {
  content: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
};

export type ReorderCollectionArticlesInput = {
  collection: Scalars["ID"]["input"];
  moves: Array<ReorderMoveInput>;
};

export type ReorderMoveInput = {
  item: Scalars["ID"]["input"];
  /** The new position move to. To move item to the beginning of the list, set to 0. To the end of the list, set to the length of the list - 1. */
  newPosition: Scalars["Int"]["input"];
};

export type ReportReason =
  | "discrimination_insult_hatred"
  | "illegal_advertising"
  | "other"
  | "pornography_involving_minors"
  | "tort";

export type ResetLikerIdInput = {
  id: Scalars["ID"]["input"];
};

export type ResetPasswordInput = {
  codeId: Scalars["ID"]["input"];
  password: Scalars["String"]["input"];
  type?: InputMaybe<ResetPasswordType>;
};

export type ResetPasswordType = "account" | "payment";

/** Enums for sorting responses. */
export type ResponseSort = "newest" | "oldest";

export type ResponsesInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  articleOnly?: InputMaybe<Scalars["Boolean"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  includeAfter?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeBefore?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<ResponseSort>;
};

/** Enums for user roles. */
export type Role = "admin" | "user" | "vistor";

export type SearchApiVersion = "v20230301" | "v20230601";

export type SearchExclude = "blocked";

export type SearchFilter = {
  authorId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type SearchInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  /** deprecated, make no effect */
  coefficients?: InputMaybe<Scalars["String"]["input"]>;
  /** specific condition for rule data out */
  exclude?: InputMaybe<SearchExclude>;
  /** extra query filter for searching */
  filter?: InputMaybe<SearchFilter>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  /** should include tags used by author */
  includeAuthorTags?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** search keyword */
  key: Scalars["String"]["input"];
  oss?: InputMaybe<Scalars["Boolean"]["input"]>;
  quicksearch?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** whether this search operation should be recorded in search history */
  record?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** types of search target */
  type: SearchTypes;
  /** use the api version; default to use latest stable version is v20230301 */
  version?: InputMaybe<SearchApiVersion>;
};

export type SearchTypes = "Article" | "Tag" | "User";

export type SendCampaignAnnouncementInput = {
  announcement: Array<TranslationInput>;
  campaign: Scalars["ID"]["input"];
  link: Scalars["link_String_NotNull_format_uri"]["input"];
  password: Scalars["String"]["input"];
};

export type SendVerificationCodeInput = {
  email: Scalars["email_String_NotNull_format_email"]["input"];
  /** email content language */
  language?: InputMaybe<UserLanguage>;
  /**
   * Redirect URL embedded in the verification email,
   * use code instead if not provided.
   */
  redirectUrl?: InputMaybe<Scalars["redirectUrl_String_format_uri"]["input"]>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  type: VerificationCodeType;
};

export type SetArticleChannelsInput = {
  channels: Array<Scalars["ID"]["input"]>;
  id: Scalars["ID"]["input"];
};

export type SetBoostInput = {
  boost: Scalars["boost_Float_NotNull_min_0"]["input"];
  id: Scalars["ID"]["input"];
  type: BoostTypes;
};

export type SetCurrencyInput = {
  currency?: InputMaybe<QuoteCurrency>;
};

export type SetEmailInput = {
  email: Scalars["String"]["input"];
};

export type SetFeatureInput = {
  flag: FeatureFlag;
  name: FeatureName;
  value?: InputMaybe<Scalars["Float"]["input"]>;
};

export type SetPasswordInput = {
  password: Scalars["String"]["input"];
};

export type SetSpamStatusInput = {
  id: Scalars["ID"]["input"];
  isSpam: Scalars["Boolean"]["input"];
};

export type SetUserNameInput = {
  userName: Scalars["String"]["input"];
};

export type SigningMessagePurpose =
  | "airdrop"
  | "claimLogbook"
  | "connect"
  | "login"
  | "signup";

export type SingleFileUploadInput = {
  draft?: InputMaybe<Scalars["Boolean"]["input"]>;
  entityId?: InputMaybe<Scalars["ID"]["input"]>;
  entityType: EntityType;
  file?: InputMaybe<Scalars["Upload"]["input"]>;
  type: AssetType;
  url?: InputMaybe<Scalars["url_String_format_uri"]["input"]>;
};

export type SkippedListItemType = "agent_hash" | "domain" | "email";

export type SkippedListItemsInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  type?: InputMaybe<SkippedListItemType>;
};

export type SocialAccountType = "Facebook" | "Google" | "Twitter";

export type SocialLoginInput = {
  authorizationCode?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth2 PKCE code_verifier for Facebook and Twitter */
  codeVerifier?: InputMaybe<Scalars["String"]["input"]>;
  /** used in register */
  language?: InputMaybe<UserLanguage>;
  /** OIDC nonce for Google */
  nonce?: InputMaybe<Scalars["String"]["input"]>;
  /** oauth token/verifier in OAuth1.0a for Twitter */
  oauth1Credential?: InputMaybe<Oauth1CredentialInput>;
  referralCode?: InputMaybe<Scalars["String"]["input"]>;
  type: SocialAccountType;
};

export type StripeAccountCountry =
  | "Australia"
  | "Austria"
  | "Belgium"
  | "Bulgaria"
  | "Canada"
  | "Cyprus"
  | "Denmark"
  | "Estonia"
  | "Finland"
  | "France"
  | "Germany"
  | "Greece"
  | "HongKong"
  | "Ireland"
  | "Italy"
  | "Latvia"
  | "Lithuania"
  | "Luxembourg"
  | "Malta"
  | "Netherlands"
  | "NewZealand"
  | "Norway"
  | "Poland"
  | "Portugal"
  | "Romania"
  | "Singapore"
  | "Slovakia"
  | "Slovenia"
  | "Spain"
  | "Sweden"
  | "UnitedKingdom"
  | "UnitedStates";

export type SubmitReportInput = {
  reason: ReportReason;
  targetId: Scalars["ID"]["input"];
};

export type SubscribeCircleInput = {
  /** Unique ID. */
  id: Scalars["ID"]["input"];
  /** Wallet password. */
  password?: InputMaybe<Scalars["String"]["input"]>;
};

export type TagArticlesInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  oss?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortBy?: InputMaybe<TagArticlesSortBy>;
};

export type TagArticlesSortBy = "byCreatedAtDesc" | "byHottestDesc";

export type TagsInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  sort?: InputMaybe<TagsSort>;
};

/** Enums for sorting tags. */
export type TagsSort = "hottest" | "newest" | "oldest";

export type ToggleCircleMemberInput = {
  /** Toggle value. */
  enabled: Scalars["Boolean"]["input"];
  /** Unique ID. */
  id: Scalars["ID"]["input"];
  /** Unique ID of target user. */
  targetId: Scalars["ID"]["input"];
};

/** Common input to toggle single item for `toggleXXX` mutations */
export type ToggleItemInput = {
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  id: Scalars["ID"]["input"];
};

export type ToggleRecommendInput = {
  enabled: Scalars["Boolean"]["input"];
  id: Scalars["ID"]["input"];
  type?: InputMaybe<RecommendTypes>;
};

export type ToggleSeedingUsersInput = {
  enabled: Scalars["Boolean"]["input"];
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type ToggleUsersBadgeInput = {
  enabled: Scalars["Boolean"]["input"];
  ids: Array<Scalars["ID"]["input"]>;
  type: BadgeType;
};

export type ToggleWritingChallengeFeaturedArticlesInput = {
  articles: Array<Scalars["ID"]["input"]>;
  campaign: Scalars["ID"]["input"];
  enabled: Scalars["Boolean"]["input"];
};

export type TopDonatorFilter = {
  inRangeEnd?: InputMaybe<Scalars["DateTime"]["input"]>;
  inRangeStart?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type TopDonatorInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TopDonatorFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
};

export type TransactionCurrency = "HKD" | "LIKE" | "USDT";

export type TransactionNoticeType =
  | "PaymentReceivedDonation"
  | "WithdrewLockedTokens";

export type TransactionPurpose =
  | "addCredit"
  | "curationVaultWithdrawal"
  | "dispute"
  | "donation"
  | "payout"
  | "payoutReversal"
  | "refund"
  | "subscriptionSplit";

export type TransactionState = "canceled" | "failed" | "pending" | "succeeded";

export type TransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TransactionsFilter>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  /** deprecated, use TransactionsFilter.id instead. */
  id?: InputMaybe<Scalars["ID"]["input"]>;
  /** deprecated, use TransactionsFilter.states instead. */
  states?: InputMaybe<Array<TransactionState>>;
};

export type TransactionsFilter = {
  currency?: InputMaybe<TransactionCurrency>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  purpose?: InputMaybe<TransactionPurpose>;
  states?: InputMaybe<Array<TransactionState>>;
};

export type TransactionsReceivedByArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  purpose: TransactionPurpose;
  senderId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type TranslatedAnnouncementInput = {
  content?: InputMaybe<Scalars["String"]["input"]>;
  cover?: InputMaybe<Scalars["String"]["input"]>;
  language: UserLanguage;
  link?: InputMaybe<Scalars["link_String_format_uri"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type TranslationArgs = {
  language: UserLanguage;
};

export type TranslationInput = {
  language: UserLanguage;
  text: Scalars["String"]["input"];
};

export type UnbindLikerIdInput = {
  id: Scalars["ID"]["input"];
  likerId: Scalars["String"]["input"];
};

export type UnlikeCollectionInput = {
  id: Scalars["ID"]["input"];
};

export type UnlikeMomentInput = {
  id: Scalars["ID"]["input"];
};

export type UnpinCommentInput = {
  id: Scalars["ID"]["input"];
};

export type UnsubscribeCircleInput = {
  /** Unique ID. */
  id: Scalars["ID"]["input"];
};

export type UnvoteCommentInput = {
  id: Scalars["ID"]["input"];
};

export type UpdateArticleSensitiveInput = {
  id: Scalars["ID"]["input"];
  sensitive: Scalars["Boolean"]["input"];
};

export type UpdateArticleStateInput = {
  id: Scalars["ID"]["input"];
  state: ArticleState;
};

export type UpdateCampaignApplicationStateInput = {
  campaign: Scalars["ID"]["input"];
  state: CampaignApplicationState;
  user: Scalars["ID"]["input"];
};

export type UpdateCommentsStateInput = {
  ids: Array<Scalars["ID"]["input"]>;
  state: CommentState;
};

export type UpdateNotificationSettingInput = {
  enabled: Scalars["Boolean"]["input"];
  type: NotificationSettingType;
};

export type UpdateUserExtraInput = {
  id: Scalars["ID"]["input"];
  referralCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateUserInfoInput = {
  agreeOn?: InputMaybe<Scalars["Boolean"]["input"]>;
  avatar?: InputMaybe<Scalars["ID"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  language?: InputMaybe<UserLanguage>;
  paymentPassword?: InputMaybe<Scalars["String"]["input"]>;
  paymentPointer?: InputMaybe<Scalars["String"]["input"]>;
  profileCover?: InputMaybe<Scalars["ID"]["input"]>;
  referralCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateUserRoleInput = {
  id: Scalars["ID"]["input"];
  role: UserRole;
};

export type UpdateUserStateInput = {
  banDays?: InputMaybe<Scalars["banDays_Int_exclusiveMin_0"]["input"]>;
  emails?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  password?: InputMaybe<Scalars["String"]["input"]>;
  state: UserState;
};

export type UserArticlesFilter = {
  state?: InputMaybe<ArticleState>;
};

export type UserArticlesInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<UserArticlesFilter>;
  first?: InputMaybe<Scalars["first_Int_min_0"]["input"]>;
  sort?: InputMaybe<UserArticlesSort>;
};

export type UserArticlesSort =
  | "mostAppreciations"
  | "mostComments"
  | "mostDonations"
  | "mostReaders"
  | "newest";

export type UserFeatureFlagType = "bypassSpamDetection";

export type UserGroup = "a" | "b";

export type UserInfoFields =
  | "agreeOn"
  | "avatar"
  | "description"
  | "displayName"
  | "email";

export type UserInput = {
  ethAddress?: InputMaybe<Scalars["String"]["input"]>;
  userName?: InputMaybe<Scalars["String"]["input"]>;
  /** used for case insensitive username search  */
  userNameCaseIgnore?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type UserLanguage = "en" | "zh_hans" | "zh_hant";

export type UserNoticeType = "UserNewFollower";

export type UserRecommendationActivitySource = "UserFollowing";

export type UserRestrictionType = "articleHottest" | "articleNewest";

export type UserRole = "admin" | "user";

export type UserState = "active" | "archived" | "banned" | "frozen";

export type VerificationCodeType =
  | "email_otp"
  | "email_verify"
  | "payment_password_reset"
  | "register";

export type VerifyEmailInput = {
  code: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
};

/** Enums for vote types. */
export type Vote = "down" | "up";

export type VoteCommentInput = {
  id: Scalars["ID"]["input"];
  vote: Vote;
};

export type WalletLoginInput = {
  ethAddress: Scalars["String"]["input"];
  /** used in register */
  language?: InputMaybe<UserLanguage>;
  /** nonce from generateSigningMessage */
  nonce: Scalars["String"]["input"];
  referralCode?: InputMaybe<Scalars["String"]["input"]>;
  /** sign'ed by wallet */
  signature: Scalars["String"]["input"];
  /** the message being sign'ed, including nonce */
  signedMessage: Scalars["String"]["input"];
};

export type WritingInput = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PutDraftMutationVariables = Exact<{
  input: PutDraftInput;
}>;

export type PutDraftMutation = {
  __typename?: "Mutation";
  putDraft: {
    __typename?: "Draft";
    id: string;
    title?: string | null;
    content?: string | null;
    slug: string;
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  viewer?: { __typename?: "User"; id: string; userName?: string | null } | null;
};
