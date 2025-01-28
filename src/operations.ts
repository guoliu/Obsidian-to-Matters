import { gql } from "graphql-tag";

export const PUT_DRAFT = gql`
	mutation PutDraft($input: PutDraftInput!) {
		putDraft(input: $input) {
			id
			title
			content
			slug
		}
	}
`;

export const VERIFY_TOKEN = gql`
	query Me {
		viewer {
			id
			userName
		}
	}
`;
