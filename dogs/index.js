import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";
import { readFileSync } from "fs";

import dogs from "./dogs.json" assert { type: "json" };

const typeDefs = gql(
    readFileSync("schema.graphql", { encoding: "utf-8" })
);

const resolvers = {
  Query: {
    allDogs: () => dogs,
    dogCount: () => dogs.length
  },
  Dog: {
    __resolveReference: ({id}) =>
        dogs.find((dog) => dog.id === id)
  },
  Cat: {
    dogBestFriend: ({id}) =>
        dogs.find((dog) => dog.unlikelyFriend === id)
  }
};

const PORT = process.env.PORT || 4002;

async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{
      typeDefs,
      resolvers
    }])
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT }
  });

  console.log(`🚀 Server running at ${url}`);
}
startApolloServer();

