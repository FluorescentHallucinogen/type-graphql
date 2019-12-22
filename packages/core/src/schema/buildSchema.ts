import { GraphQLSchema } from "graphql";

import BuildSchemaOptions from "@src/schema/BuildSchemaOptions";
import SchemaGenerator from "@src/schema/SchemaGenerator";

/**
 * Builds an executable `GraphQLSchema` object
 * based on resolver and type classes provided in options.
 */
export default async function buildSchema(
  options: BuildSchemaOptions,
): Promise<GraphQLSchema> {
  const schemaGenerator = new SchemaGenerator(options);
  // TODO: remove the falsy async placeholder
  await new Promise(r => setImmediate(r));
  return schemaGenerator.generate();
}
