import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";
import { readFileSync } from "fs";

import cats from "./cats.json" assert { type: "json" };

const typeDefs = gql(
    readFileSync("schema.graphql", { encoding: "utf-8" })
);

const resolvers = {
  Query: {
    allCats: () => cats,
    catCount: () => cats.length
  },
  Dog: {
    catBestFriend: (root) => {
      cats.find((cat) => cat.dogBestFriend === root.id);
    }
  },
  Cat: {
    __resolveReference: ({id}) =>
        cats.find((cat) => cat.id === id)
  },
  Mutation: {
    setEmotionalStatus: (root, {id, status}) => {
      let updatedStatus = cats.find(cat => id === cat.id);
      if (!updatedStatus) {
        return {
          message: "No cat with that id. Try again!"
        };
      }
      updatedStatus.status = status;
      return updatedStatus;
    }
  },
  EmotionalStatusResponse: {
    __resolveType: (root) =>
        root.name ? "Cat" : "Error"
  }
};

const PORT = process.env.PORT || 4001;
async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({
      typeDefs,
      resolvers
    })
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT }
  });
  console.log(`Service running at ${url}`);
}
startApolloServer();
