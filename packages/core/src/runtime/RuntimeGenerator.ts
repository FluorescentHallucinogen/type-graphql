import createDebug from "debug";
import { GraphQLFieldResolver } from "graphql";

import BuiltQueryMetadata from "@src/metadata/builder/definitions/QueryMetadata";
import { BuildSchemaConfig } from "@src/schema/schema-config";
import ResolverData from "@src/interfaces/ResolverData";
import { DynamicResolverInstance } from "@src/runtime/types";

const debug = createDebug("@typegraphql/core:RuntimeGenerator");

export default class RuntimeGenerator<TContext extends object = {}> {
  constructor(private readonly config: BuildSchemaConfig<TContext>) {
    debug("created RuntimeGenerator instance", config);
  }

  generateQueryResolveHandler({
    target,
    propertyKey,
  }: BuiltQueryMetadata): GraphQLFieldResolver<unknown, TContext, object> {
    const { container } = this.config;
    return (source, args, context, info) => {
      const resolverData: ResolverData<TContext> = {
        source,
        args,
        context,
        info,
      };
      const resolverInstance = container.getInstance(
        target,
        resolverData,
      ) as DynamicResolverInstance;
      // workaround until TS support indexing by symbol
      // https://github.com/microsoft/TypeScript/issues/1863
      const methodName = propertyKey as string;
      return resolverInstance[methodName]();
    };
  }
}
