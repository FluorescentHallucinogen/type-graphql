import { GraphQLSchema } from "graphql";
import { BuildSchemaOptions, buildSchema } from "@typegraphql/core";

import TestResolver from "@tests/helpers/TestResolver";

export default async function buildTestSchema<TContext extends object = {}>(
  options: Partial<BuildSchemaOptions<TContext>>,
): Promise<GraphQLSchema> {
  return buildSchema<TContext>({
    ...options,
    resolvers: [TestResolver, ...(options.resolvers ?? [])],
  });
}
