import createDebug from "debug";
import { GraphQLFieldResolver } from "graphql";

import { BuildSchemaConfig } from "@src/schema/schema-config";
import ResolverData from "@src/interfaces/ResolverData";
import { DynamicResolverInstance } from "@src/runtime/types";
import completeValue from "@src/runtime/helpers/completeValue";
import completeValues from "@src/runtime/helpers/completeValues";
import ParameterMetadata from "@src/interfaces/metadata/parameters/ParameterMetadata";
import {
  TargetClassMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import ResolverHandlerParametersMetadata from "@src/interfaces/metadata/ResolverHandlerParametersMetadata";

const debug = createDebug("@typegraphql/core:RuntimeGenerator");

export default class RuntimeGenerator<TContext extends object = {}> {
  constructor(private readonly config: BuildSchemaConfig<TContext>) {
    debug("created RuntimeGenerator instance", config);
  }

  generateResolveHandler({
    targetClass,
    propertyKey,
    parameters,
  }: TargetClassMetadata &
    PropertyMetadata &
    ResolverHandlerParametersMetadata): GraphQLFieldResolver<
    unknown,
    TContext,
    object
  > {
    const { container } = this.config;
    return (source, args, context, info) => {
      const resolverData: ResolverData<TContext> = {
        source,
        args,
        context,
        info,
      };
      return completeValues(
        this.getResolvedParameters(parameters, resolverData),
        resolvedParameters =>
          completeValue(
            container.getInstance(targetClass, resolverData),
            (resolverInstance: DynamicResolverInstance) => {
              // workaround until TS support indexing by symbol
              // https://github.com/microsoft/TypeScript/issues/1863
              const methodName = propertyKey as string;
              // TODO: maybe replace with `.apply()` for perf reasons?
              return resolverInstance[methodName](...resolvedParameters);
            },
          ),
      );
    };
  }

  private getResolvedParameters(
    parameters: readonly ParameterMetadata[],
    resolverData: ResolverData<TContext>,
  ): Array<PromiseLike<unknown> | unknown> {
    const { container } = this.config;
    return parameters
      .slice()
      .sort((a, b) => a.parameterIndex - b.parameterIndex)
      .map(parameterMetadata =>
        completeValue(
          container.getInstance(
            parameterMetadata.parameterResolverClass,
            resolverData,
          ),
          parameterResolver =>
            parameterResolver.resolve(resolverData, parameterMetadata),
        ),
      );
  }
}
