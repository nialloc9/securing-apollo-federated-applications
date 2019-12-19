const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { createRateLimitRule, RedisStore } = require('graphql-rate-limit');
const redis = require('redis');
const { shield } = require('graphql-shield');
const { applyMiddleware } = require('graphql-middleware');

const { RHOST } = process.env;

const rateLimit = createRateLimitRule({
  identifyContext: ctx => ctx.id,
  formatError: ({ fieldName }) => {
    console.log("format", fieldName)
    return `[RATE_LIMIT] Woah there ✋, you are doing way too much ${fieldName}`;
  },
  store: new RedisStore(redis.createClient({host: RHOST}))
});

const permissions = shield({
  Query: {
    hello1: rateLimit({
      max: 1,
      window: '10s'
    })
  }
});

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
  schema: applyMiddleware(buildFederatedSchema({
    typeDefs: query,
    resolvers
  }), permissions),
  introspection: !isProduction,
  playground: !isProduction,
  subscriptions: false,
 });

server.listen().then(({ url }) => {
    console.log(`🚀 ExampleTestServer1 ready at ${url}`);
});