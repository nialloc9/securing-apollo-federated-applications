const {ApolloServer} = require('apollo-server');
const {ApolloGateway} = require('@apollo/gateway');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
const depthLimit = require('graphql-depth-limit');

const { NODE_ENV, SERVER_1_URL, SERVER_2_URL } = process.env;

// change this values and see test validation in playground
const config = {
  maximumCost: 1000,
  scalarCost: 200,
  objectCost: 10, // Default is 0.
  listFactor: 20, // Default is 10.
  depthLimit: 10
}

// less control then graphql-cost-analysis
const complexityLimit = createComplexityLimitRule(config.maximumCost, {
  scalarCost: config.scalarCost,
  objectCost: config.objectCost, // Default is 0.
  listFactor: config.listFactor, // Default is 10.
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
    depthLimit(config.depthLimit) // prevents too deeply nested queries and cyclcal queiries
  ],
});

server.listen().then(({ url }) => {
  console.log(`🚀 Apollo Gateway Server ready at ${url}`);
});
