import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";

import dogs from "./data/dogs.js";

const typeDefs = gql`
  type Dog {
    id: ID!
    name: String!
    weight: Float!
    photo: Photo!
  }

  type Photo {
    full: String!
    thumb: String!
  }

  type Query {
    allDogs: [Dog!]!
    dogCount: Int!
  }
`;

const resolvers = {
  Query: {
    allDogs: () => dogs,
    dogCount: () => dogs.length
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

