const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const isProduction = process.env.NODE_ENV === 'production';

const query = gql`
  type Query {
    hello1: String,
    exampleInternalError: String
  }
`;

const resolvers = {
    Query: {
        hello1: () => "Hello from test1 server",
        exampleInternalError: () => {
          throw new Error("Hello1 Error");
        },
    },
};

const server = new ApolloServer({ 
  schema: buildFederatedSchema({
    typeDefs: query,
    resolvers
  }),
  introspection: !isProduction,
  playground: !isProduction,
  subscriptions: false,
 });

server.listen().then(({ url }) => {
    console.log(`🚀 ExampleTestServer1 ready at ${url}`);
});