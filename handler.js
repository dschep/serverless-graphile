const { Pool } = require("pg");
const {
  createPostGraphileSchema,
  withPostGraphileContext,
} = require("postgraphile");
const { graphql } = require("graphql");

let pgPool;
let schema;

module.exports.graphile = async (event, context) => {
  if (!pgPool) {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // this ensures the pool can drop a connection if it has gone bad
      min: 0,
      // no need for more since we are in Lambda-land
      max: 1,
    });
  }

  if (!schema) {
    schema = await createPostGraphileSchema(pgPool, ["public"], {
      dynamicJson: true,
      ignoreRBAC: false,
      ignoreIndexes: false,
      ...(process.env.APPEND_PLUGINS
        ? {
            appendPlugins: process.env.APPEND_PLUGINS.split(" ")
              .map(require)
              .map((module) => (module.default ? module.default : module)),
          }
        : {}),
    });
  }
  const { query, variables, operationName } = JSON.parse(event.body);
  const result = await withPostGraphileContext(
    {
      pgPool,
      // TODO - test JWT
      // jwtSecret: process.env.JWT_SECRET,
      // jwtToken: event.headers.Authorization.split(" ")[1],
    },
    (context) =>
      graphql(schema, query, null, { ...context }, variables, operationName)
  );

  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(result),
  };
};
