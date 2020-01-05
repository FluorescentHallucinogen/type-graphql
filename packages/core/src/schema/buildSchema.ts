import { GraphQLSchema } from "graphql";

import BuildSchemaOptions from "@src/schema/BuildSchemaOptions";
import SchemaGenerator from "@src/schema/SchemaGenerator";

/**
 * Builds an executable `GraphQLSchema` object
 * based on resolver and type classes provided in options
 */
export default async function buildSchema<TContext extends object = {}>(
  options: BuildSchemaOptions<TContext>,
): Promise<GraphQLSchema> {
  const schemaGenerator = new SchemaGenerator(options);
  // TODO: remove the falsy async placeholder
  await Promise.resolve();
  return schemaGenerator.generateSchema();
}
