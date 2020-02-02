import { printType } from "graphql";

import { ClassType, buildSchema, BuildSchemaOptions } from "@typegraphql/core";

export default async function getPrintedQueryType(
  resolverClass: ClassType,
  options?: Omit<BuildSchemaOptions, "resolvers">,
): Promise<string> {
  const schema = await buildSchema({
    ...options,
    resolvers: [resolverClass],
  });
  const type = schema.getQueryType()!;
  return printType(type);
}
