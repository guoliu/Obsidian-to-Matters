import { type ASTNode } from 'graphql/language/ast';
import { print } from 'graphql/language/printer';
import { Modal, Notice, requestUrl } from 'obsidian';

import Publisher from 'main';
import { SERVER_ENDPOINTS } from './settings';
import { type MeQuery } from './generated/graphql';
import { ME } from './operations';

/**
 * Modal class that handdles Matters GQL query and authentication
 */
export class QueryModal extends Modal {
  sendQuery: <D, I = void>(query: ASTNode, input?: I, noCache?: boolean) => Promise<D>;
  plugin: Publisher;

  constructor(plugin: Publisher) {
    super(plugin.app);

    this.plugin = plugin;

    // send query to GQL server
    const { environment, accessToken } = plugin.settings;
    this.sendQuery = async (query, input, noCache = false) => {
      try {
        // get query string from AST
        const querString = print(query);

        let headers = {
          'content-type': 'application/json',
          'x-access-token': accessToken,
        } as Record<string, string>;

        if (noCache) {
          headers = {
            ...headers,
            'cache-control': 'no-cache, no-store, must-revalidate',
            pragma: 'no-cache',
            expires: '0',
          };
        }

        // send query to GQL server
        const response = await requestUrl({
          url: SERVER_ENDPOINTS[environment],
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-access-token': accessToken,
          },
          body: JSON.stringify({
            query: querString,
            variables: { input },
          }),
        });

        console.log({ response });

        // handle GQL errors
        const { errors } = response.json;
        if (errors) {
          throw new Error(errors[0].message);
        }

        return response.json.data;
      } catch (error) {
        console.error('Error in sending query:', error);
        throw error;
      }
    };
  }

  async verifyToken(): Promise<boolean> {
    try {
      const data = await this.sendQuery<MeQuery>(ME);
      return !!data?.viewer?.id;
    } catch (error) {
      console.error('Token verification failed:', error);
      new Notice('Token verification failed. Please check your access token.');
      return false;
    }
  }
}
