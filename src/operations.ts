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

export const ME = gql`
  query Me {
    viewer {
      id
      userName
    }
  }
`;
