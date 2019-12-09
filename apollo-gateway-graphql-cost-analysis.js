const {ApolloServer} = require('apollo-server');
const {ApolloGateway} = require('@apollo/gateway');
const costAnalysis = require('graphql-cost-analysis').default;
const depthLimit = require('graphql-depth-limit');

const { NODE_ENV, SERVER_1_URL, SERVER_2_URL } = process.env;

// change this values and see test validation in playground
const config = {
  maximumCost: 1000,
  hello1Complexity: 200,
  paginationExampleLastComplexity: 500, // Default is 0.
  hello2Complexity: 1200, // Default is 10.
  depthLimit: 10
}

// Can determine through the schema using apollo engine and assign a value based on the p99 service time
const costMap = {
    Query: {
        hello1: {
          complexity: config.hello1Complexity,
        }
    },
    Query: {
        hello2: {
          complexity: config.hello2Complexity,
        },
    },
    Query: {
      paginationExample: {
        multipliers: ['last'],
        useMultipliers: true,
        complexity: config.paginationExampleLastComplexity,
      }
    }
};

const complexityLimit = costAnalysis({
    costMap,
    maximumCost: config.maximumCost,
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
    console.error("errors", error);
    return new Error("Internal Error");
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
