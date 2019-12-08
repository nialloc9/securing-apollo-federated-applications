const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const {
  createIntScalar
} = require('graphql-scalar');

const isProduction = process.env.NODE_ENV === 'production';

const argType = createIntScalar({
  name: 'OneToTwoInt',
  minimum: 1,
  maximum: 2,
});

const query = gql`

  scalar OneToTwoInt

  type Query {
    hello2: String,
    paginationExample(last: OneToTwoInt!) : [String]
  }
`;

const resolvers = {
    OneToTwoInt: argType,
    Query: {
      hello2: () => "Hello from test2 server",
      paginationExample: (_, { last = 1 })  => {

        const exampleData = ["1", "2", "3", "1", "2", "3", "1", "2", "3"];

        const newArray = [...exampleData];

        newArray.length = last;

        return newArray;
      }
    }
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
    console.log(`🚀 ExampleTestServer2 ready at ${url}`);
});