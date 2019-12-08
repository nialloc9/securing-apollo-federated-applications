const {ApolloServer} = require('apollo-server');
const {ApolloGateway} = require('@apollo/gateway');
const costAnalysis = require('graphql-cost-analysis').default;
const depthLimit = require('graphql-depth-limit');

const { NODE_ENV, SERVER_1_URL, SERVER_2_URL } = process.env;

// Can determine through the schema using apollo engine and assign a value based on the p99 service time
const costMap = {
    Query: {
        hello1: {
          complexity: 200,
        },
        paginationExample: {
          multipliers: ['last'],
          useMultipliers: true,
          complexity: 500,
        }
    },
    Query: {
        hello2: {
          complexity: 1200,
        },
    },
    Query: {
      paginationExample: {
        multipliers: ['last'],
        useMultipliers: true,
        complexity: 500,
      }
    }
};

const complexityLimit = costAnalysis({
    costMap,
    maximumCost: 1000,
    onComplete: cost => console.log("cost", cost)
})

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
