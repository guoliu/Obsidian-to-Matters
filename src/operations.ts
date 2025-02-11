import { gql } from 'graphql-tag';

export const GET_ARTICLE = gql`
  query GetArticle($input: ArticleInput!) {
    article(input: $input) {
      id
      title
    }
  }
`;

export const PUT_DRAFT = gql`
  mutation PutDraft($input: PutDraftInput!) {
    putDraft(input: $input) {
      id
      title
      content
      summary
      collection(input: { first: 10 }) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  }
`;

export const PUBLISH_ARTICLE = gql`
  mutation PublishArticle($input: PublishArticleInput!) {
    publishArticle(input: $input) {
      id
      article {
        id
        shortHash
      }
    }
  }
`;

export const GET_PUBLISHED_ARTICLE = gql`
  query GetPublishedArticle($input: NodeInput!) {
    node(input: $input) {
      id
      ... on Draft {
        publishState
        article {
          id
          title
          shortHash
        }
      }
    }
  }
`;

export const ME = gql`
  query Me {
    viewer {
      id
      userName
    }
  }
`;

export const DIRECT_IMAGE_UPLOAD = gql`
  mutation DirectImageUpload($input: DirectImageUploadInput!) {
    directImageUpload(input: $input) {
      id
      uploadURL
      path
    }
  }
`;
