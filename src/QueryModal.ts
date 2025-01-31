import { ASTNode } from "graphql/language/ast";
import { print } from "graphql/language/printer";
import { Modal, requestUrl } from "obsidian";

import Publisher from "main";
import { SERVER_ENDPOINTS } from "./settings";

/**
 * Modal class with Matters GQL query
 */
export class QueryModal extends Modal {
  sendQuery: <D, I = void>(query: ASTNode, input?: I) => Promise<D>;
  plugin: Publisher;

  constructor(plugin: Publisher) {
    super(plugin.app);

    this.plugin = plugin;

    // send query to GQL server
    const settings = plugin.settings;
    this.sendQuery = async (query, input) => {
      try {
        const querString = print(query);

        const response = await requestUrl({
          url: SERVER_ENDPOINTS[settings.environment],
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-access-token": settings.accessToken,
          },
          body: JSON.stringify({
            query: querString,
            variables: { input },
          }),
        });

        const { errors } = response.json;
        if (errors) {
          throw new Error(errors[0].message);
        }

        return response.json.data;
      } catch (error) {
        console.error("Error in sending query:", error);
        throw error;
      }
    };
  }
}
