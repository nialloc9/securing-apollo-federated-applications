const {ApolloServer} = require('apollo-server');
const {ApolloGateway} = require('@apollo/gateway');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
const depthLimit = require('graphql-depth-limit');

const { NODE_ENV, SERVER_1_URL, SERVER_2_URL } = process.env;

const complexityLimit = createComplexityLimitRule(1000, {
  scalarCost: 200,
  objectCost: 10, // Default is 0.
  listFactor: 20, // Default is 10.
  onCost: (cost) => {
    console.log('query cost:', cost);
  },
});

const gateway = new ApolloGateway({
  serviceList: [
    {name: 'example-test-server-1', url: SERVER_1_URL},
    {name: 'example-test-server-2', url: SERVER_2_URL},
  ],
});

const server = new ApolloServer({
  gateway,
  playground: NODE_ENV !== 'production',
  subscriptions: false,
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
  validationRules: [
    complexityLimit,
    depthLimit(10) // prevents too deeply nested queries and cyclcal queiries
  ],
});

server.listen().then(({ url }) => {
  console.log(`🚀 Apollo Gateway Server ready at ${url}`);
});
