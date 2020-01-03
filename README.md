# Securing a federated graphql api
An example of using differant technologies to secure a federated graphql API using [Apollo Server](https://www.apollographql.com/docs/apollo-server/). Read about this project on [Medium](https://medium.com/@nialloc9/contract-testing-an-apollo-federated-gateway-with-pact-io-and-pactflow-io-3d185da2985c). Depth limiting, amount limiting, and rate limiting are used with both examples but graphql-validation-complexity is used with one and graphql-cost-analysis is used with the other for complexity limiting. This is to compare the two. Both of these can be used with directives but since apollo does not support this when using federation finding a way to do this is imperitive.

After research and working with both complexity limiting libraries it is concluded that graphql-cost-analysis and graphql-validation-complexity can be used without directives but graphql-cost-analysis is significantly more flexible using a cost map. This allows us to define a complexity map on the gateway against our schema.

In some of the examples I have added validation at the gateway level to demonstrate it can be done here but in most cases you would want it on the individual entities. Take complexity for example. If you said the gateway can have a maximum query complexity of 5000 points then you would be limiting yourself as you would have to have this as the lowest complexity of the entities as all 5000 could be passed to just 1 entity. However, maybe entity 2 can handle more and therefore should be at the entity level.

The main difference between federated applications and regular applications is that directives do not work so therefore other alternatives had to be found. The issue can be found [here](https://github.com/apollographql/apollo-feature-requests/issues/145). (Update as of 19/12/19 schemas can merged using mergeSchemas function and directives can be added)

<p align="center">
  <img src="/images/attack.jpg" width="700" title="Attacking API">
</p>

## Prerequisites
 
- Install [docker](https://www.docker.com/)
- Install [docker compose](https://docs.docker.com/compose/)

## Technologies

- [graphql-depth-limit](https://github.com/stems/graphql-depth-limit)
- [graphql-scalar](https://github.com/stems/graphql-scalar)
- [graphql-validation-complexity](https://github.com/stems/graphql-validation-complexity)
- [graphql-cost-analysis](https://github.com/stems/graphql-cost-analysis)

## Usage

### Running the server
    $ npm install
    $ docker-compose up {federated service name} example-test-server-1 example-test-server-2 (e.g docker-compose up apollo-gateway-graphql-cost-analysis example-test-server-1 example-test-server-2)

## Resource limiting

### apollo-gateway-graphql-cost-analysis

    $ docker-compose up apollo-gateway-graphql-cost-analysis example-test-server-1 example-test-server-2

#### Cost okay

<p align="center">
  <img src="/images/screenshots/graphql-cost-analysis-okay.png" width="700" title="graphql validation complexity okay">
</p>

#### Cost denied

<p align="center">
  <img src="/images/screenshots/graphql-cost-analysis-limit-exceeded.png" width="700" title="graphql validation complexity okay">
</p>

### apollo-gateway-graphql-validation-complexity

    $ docker-compose up apollo-gateway-graphql-validation-complexity example-test-server-1 example-test-server-2

#### Cost okay

<p align="center">
  <img src="/images/screenshots/graphql-validation-complexity-okay.png" width="700" title="graphql validation complexity okay">
</p>

#### Cost denied

<p align="center">
  <img src="/images/screenshots/graphql-validation-complexity-limit-exceeded.png" width="700" title="graphql validation complexity denied">
</p>

### Amount Limiting

#### Cost okay

<p align="center">
  <img src="/images/screenshots/amount-limiting-okay.png" width="700" title="graphql validation amount okay">
</p>

#### Cost denied

<p align="center">
  <img src="/images/screenshots/amount-limiting-denied.png" width="700" title="graphql validation amount denied">
</p>

### graphql-depth-limit

```js
  const depthLimit = require('graphql-depth-limit');

  validationRules: [
    depthLimit(10) // prevents too deeply nested queries and cyclical queiries
  ],
```

### Rate Limiting

#### Limit okay

<p align="center">
  <img src="/images/screenshots/rate-limiting-okay.png" width="700" title="graphql validation rate limiting okay">
</p>

#### Limit denied

<p align="center">
  <img src="/images/screenshots/rate-limiting-denied.png" width="700" title="graphql validation rate limiting denied">
</p>

### graphql-depth-limit

```js
  const depthLimit = require('graphql-depth-limit');

  validationRules: [
    depthLimit(10) // prevents too deeply nested queries and cyclical queiries
  ],
```

## Error handling

### Verbose error messaging

To prevent unwanted insights into your application being passed to the user verbose error messaging should be added.


```js
  const server = new ApolloServer({
    ....
    formatError: error => {
      console.error("errors", error);
      return new Error("Internal Error");
    },
    ...
  });
```

<p align="center">
  <img src="/images/screenshots/example-internal-error.png" width="700" title="Internal Error">
</p>
