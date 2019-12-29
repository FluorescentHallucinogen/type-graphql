import { printType } from "graphql";

import { ClassType, buildSchema, BuildSchemaOptions } from "@typegraphql/core";

export default async function getPrintedQuery(
  resolverClass: ClassType,
  options?: Partial<BuildSchemaOptions>,
): Promise<string> {
  const schema = await buildSchema({
    resolvers: [resolverClass],
    ...options,
  });
  const type = schema.getQueryType()!;
  return printType(type);
}
