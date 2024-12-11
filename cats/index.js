import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";

// import cats from "./cats.json" assert { type: "json" };
const cats = [
  {
    id: "1",
    name: "Fluffy",
    weight: 15.3,
    photo: {
      full: "https://cdn.example.com/fluffy.jpg",
      thumb: "https://cdn.example" + ".com/fluffy-thumb.jpg",
    },
  },
  {
    id: "2",
    name: "Mittens",
    weight: 10.1,
    photo: {
      full: "https://cdn.example.com/mittens.jpg",
      thumb: "https://cdn.example" + ".com/mittens-thumb.jpg",
    },
  },
  {
    id: "3",
    name: "Snowball",
    weight: 12.7,
    photo: {
      full: "https://cdn.example.com/snowball.jpg",
      thumb: "https://cdn.example" + ".com/snowball-thumb.jpg",
    },
  },
];

const PORT = process.env.PORT || 4001;
const typeDefs = gql`
  type Cat {
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
    allCats: [Cat!]!
    catCount: Int!
  }
`;

const resolvers = {
  Query: {
    allCats: () => cats,
    catCount: () => cats.length,
  },
};

async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT }
  });
  console.log(`Service running at ${url}`);
}
startApolloServer();

