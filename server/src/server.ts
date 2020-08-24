import express from "express";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import schema from "./schema";

export class Server {
  private logger: any;
  constructor() {
    this.logger = require("./logger").logger("server");
  }
  /**
   * Start the backend graphql server on the given port
   * @param {Number} port the port to start on
   */
  startBackend(port: number) {
    const app = express();

    app.use(
      "",
      express.static(__dirname + "/../node_modules/boldrei-client/public")
    );

    schema.then(schema => {
      const server = new ApolloServer({
        schema
      });

      server.applyMiddleware({
        app
      });

      const httpServer = http.createServer(app);
      server.installSubscriptionHandlers(httpServer);

      httpServer.listen(port, () => {
        this.logger.info(
          `Boldrei ready at http://localhost:${port}${server.graphqlPath}`
        );
        this.logger.info(
          `Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
        );
      });
    });
  }
}
