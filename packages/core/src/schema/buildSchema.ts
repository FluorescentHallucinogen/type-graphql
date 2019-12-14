import { GraphQLSchema } from "graphql";

import BuildSchemaOptions from "@src/schema/BuildSchemaOptions";
import SchemaGenerator from "@src/schema/SchemaGenerator";

export default async function buildSchema(
  options: BuildSchemaOptions,
): Promise<GraphQLSchema> {
  const schemaGenerator = new SchemaGenerator(options);
  // TODO: remove the falsy async placeholder
  await new Promise(r => setImmediate(r));
  return schemaGenerator.generate();
}
