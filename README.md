# resource limiting
An example of using differant technologies to to handle resource limiting a federated graphql API using [Apollo Server](https://www.apollographql.com/docs/apollo-server/). Depth limiting and amount limiting are used with both examples but graphql-validation-complexity is used with one and graphql-cost-analysis is used with the other for complexity limiting. This is to compare the 2. Both of these can be used with directives but since apollo does not support this on the federated gateway then finding a way to do this is imperitive.

After research and working with both complexity limiting libraries it is concluded that graphql-cost-analysis and graphql-validation-complexity can be used without directives but graphql-cost-analysis is significantly more flexible using a cost map. This allows us to define a complexity map on the gateway against our schema.

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

### graphql-validation-complexity

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
    depthLimit(10) // prevents too deeply nested queries and cyclcal queiries
  ],
```

