import createDebug from "debug";

import ClassType from "@src/interfaces/ClassType";
import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import ObjectTypeMetadata from "@src/interfaces/metadata/ObjectTypeMetadata";
import FieldMetadata from "@src/interfaces/metadata/FieldMetadata";
import {
  getPropertyTypeMetadata,
  getMethodTypeMetadata,
  getMethodParameterTypeMetadata,
} from "@src/metadata/builder/type-reflection";
import MissingClassMetadataError from "@src/errors/MissingClassMetadataError";
import MissingFieldsError from "@src/errors/MissingFieldsError";
import ResolverMetadata from "@src/interfaces/metadata/ResolverMetadata";
import QueryMetadata from "@src/interfaces/metadata/QueryMetadata";
import MissingResolverMethodsError from "@src/errors/MissingResolverMethodsError";
import { BuildSchemaConfig } from "@src/schema/schema-config";
import InputTypeMetadata from "@src/interfaces/metadata/InputTypeMetadata";
import ParamKind from "@src/interfaces/ParamKind";
import ParameterMetadata from "@src/interfaces/metadata/parameters/ParameterMetadata";
import isTypeValueClassType from "@src/helpers/isTypeValueClassType";
import SimultaneousArgsUsageError from "@src/errors/SimultaneousArgsUsageError";
import WrongArgsTypeError from "@src/errors/WrongArgsTypeError";
import MultipleArgsUsageError from "@src/errors/MultipleArgsUsageError";
import RawParameterMetadata from "@src/metadata/storage/definitions/parameters/ParameterMetadata";
import {
  TargetClassMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import MutationMetadata from "@src/interfaces/metadata/MutationMetadata";
import RawBaseResolverHandlerMetadata from "@src/metadata/storage/definitions/BaseResolverHandlerMetadata";
import BaseResolverHandlerMetadata from "@src/interfaces/metadata/BaseResolverHandlerMetadata";
import ResolverHandlerKind from "@src/interfaces/metadata/ResolverHandlerKind";
import RawResolveFieldMetadata from "@src/metadata/storage/definitions/FieldResolverMetadata";
import ResolveFieldMetadata from "@src/interfaces/metadata/ResolveFieldMetadata";

const debug = createDebug("@typegraphql/core:MetadataBuilder");

export default class MetadataBuilder<TContext extends object = {}> {
  protected readonly objectTypeMetadataByClassMap = new WeakMap<
    ClassType,
    ObjectTypeMetadata
  >();
  protected readonly inputTypeMetadataByClassMap = new WeakMap<
    ClassType,
    InputTypeMetadata
  >();
  protected readonly resolverMetadataByClassMap = new WeakMap<
    ClassType,
    ResolverMetadata
  >();

  constructor(protected readonly config: BuildSchemaConfig<TContext>) {
    debug("created MetadataBuilder instance", config);
  }

  getObjectTypeMetadataByClass(objectTypeClass: ClassType): ObjectTypeMetadata {
    if (this.objectTypeMetadataByClassMap.has(objectTypeClass)) {
      return this.objectTypeMetadataByClassMap.get(objectTypeClass)!;
    }

    const rawObjectTypeMetadata = RawMetadataStorage.get().findObjectTypeMetadata(
      objectTypeClass,
    );
    if (!rawObjectTypeMetadata) {
      throw new MissingClassMetadataError(objectTypeClass, "ObjectType");
    }

    const rawObjectTypeFieldsMetadata = RawMetadataStorage.get().findFieldsMetadata(
      objectTypeClass,
    );
    if (
      !rawObjectTypeFieldsMetadata ||
      rawObjectTypeFieldsMetadata.length === 0
    ) {
      throw new MissingFieldsError(objectTypeClass);
    }
    const objectTypeResolveFieldMetadata =
      RawMetadataStorage.get().findResolveFieldsMetadata(objectTypeClass) ?? [];

    const objectTypeMetadata: ObjectTypeMetadata = {
      ...rawObjectTypeMetadata,
      fields: rawObjectTypeFieldsMetadata.map<FieldMetadata>(fieldMetadata => {
        const resolveField = objectTypeResolveFieldMetadata.find(
          it => it.propertyKey === fieldMetadata.propertyKey,
        );
        return {
          ...fieldMetadata,
          type: getPropertyTypeMetadata(
            fieldMetadata,
            this.config.nullableByDefault,
          ),
          resolveField: this.buildResolveFieldMetadata(resolveField),
        };
      }),
    };

    this.objectTypeMetadataByClassMap.set(objectTypeClass, objectTypeMetadata);
    return objectTypeMetadata;
  }

  getInputTypeMetadataByClass(typeClass: ClassType): InputTypeMetadata {
    if (this.inputTypeMetadataByClassMap.has(typeClass)) {
      return this.inputTypeMetadataByClassMap.get(typeClass)!;
    }

    const rawInputTypeMetadata = RawMetadataStorage.get().findInputTypeMetadata(
      typeClass,
    );
    if (!rawInputTypeMetadata) {
      throw new MissingClassMetadataError(typeClass, "InputType");
    }

    const rawInputTypeFieldsMetadata = RawMetadataStorage.get().findFieldsMetadata(
      typeClass,
    );
    if (
      !rawInputTypeFieldsMetadata ||
      rawInputTypeFieldsMetadata.length === 0
    ) {
      throw new MissingFieldsError(typeClass);
    }

    const inputTypeMetadata: InputTypeMetadata = {
      ...rawInputTypeMetadata,
      fields: rawInputTypeFieldsMetadata.map<FieldMetadata>(fieldMetadata => ({
        ...fieldMetadata,
        type: getPropertyTypeMetadata(
          fieldMetadata,
          this.config.nullableByDefault,
        ),
      })),
    };

    this.inputTypeMetadataByClassMap.set(typeClass, inputTypeMetadata);
    return inputTypeMetadata;
  }

  getResolverMetadataByClass(resolverClass: ClassType): ResolverMetadata {
    if (this.resolverMetadataByClassMap.has(resolverClass)) {
      return this.resolverMetadataByClassMap.get(resolverClass)!;
    }

    const rawResolverMetadata = RawMetadataStorage.get().findResolverMetadata(
      resolverClass,
    );
    if (!rawResolverMetadata) {
      throw new MissingClassMetadataError(resolverClass, "Resolver");
    }

    const rawQueriesMetadata =
      RawMetadataStorage.get().findQueriesMetadata(resolverClass) ?? [];
    const rawMutationsMetadata =
      RawMetadataStorage.get().findMutationsMetadata(resolverClass) ?? [];
    // TODO: also check for subscriptions and field resolvers
    if (rawQueriesMetadata.length === 0 && rawMutationsMetadata.length === 0) {
      throw new MissingResolverMethodsError(resolverClass);
    }

    const resolverMetadata: ResolverMetadata = {
      ...rawResolverMetadata,
      queries: rawQueriesMetadata.map<QueryMetadata>(rawQueryMetadata => {
        return {
          ...this.buildResolverHandlerMetadata(
            ResolverHandlerKind.Query,
            rawQueryMetadata,
            resolverClass,
          ),
        };
      }),
      mutations: rawMutationsMetadata.map<MutationMetadata>(
        rawMutationMetadata => {
          return {
            ...this.buildResolverHandlerMetadata(
              ResolverHandlerKind.Mutation,
              rawMutationMetadata,
              resolverClass,
            ),
          };
        },
      ),
    };

    this.resolverMetadataByClassMap.set(resolverClass, resolverMetadata);
    return resolverMetadata;
  }

  private buildResolverHandlerMetadata(
    kind: ResolverHandlerKind,
    handlerMetadata: RawBaseResolverHandlerMetadata,
    resolverClass: ClassType,
  ): BaseResolverHandlerMetadata {
    const rawResolverParametersMetadata =
      RawMetadataStorage.get().findParametersMetadata(
        resolverClass,
        handlerMetadata.propertyKey,
      ) ?? [];
    this.checkArgsParametersUsage(
      rawResolverParametersMetadata,
      handlerMetadata,
    );
    return {
      ...handlerMetadata,
      type: getMethodTypeMetadata(
        handlerMetadata,
        this.config.nullableByDefault,
        kind,
      ),
      parameters: this.buildParametersMetadata(rawResolverParametersMetadata),
    };
  }

  private buildParametersMetadata(
    rawParametersMetadata: RawParameterMetadata[],
  ): ParameterMetadata[] {
    return rawParametersMetadata.map<ParameterMetadata>(
      rawParameterMetadata => {
        switch (rawParameterMetadata.kind) {
          case ParamKind.SingleArg: {
            return {
              ...rawParameterMetadata,
              type: getMethodParameterTypeMetadata(
                rawParameterMetadata,
                this.config.nullableByDefault,
              ),
            };
          }
          case ParamKind.SpreadArgs: {
            const type = getMethodParameterTypeMetadata(
              rawParameterMetadata,
              this.config.nullableByDefault,
            );
            if (
              !isTypeValueClassType(type.value) ||
              type.modifiers.listDepth > 0
            ) {
              throw new WrongArgsTypeError(rawParameterMetadata);
            }
            return {
              ...rawParameterMetadata,
              type,
            };
          }
          default:
            return rawParameterMetadata;
        }
      },
    );
  }

  private checkArgsParametersUsage(
    rawParametersMetadata: RawParameterMetadata[],
    metadata: TargetClassMetadata & PropertyMetadata,
  ): void {
    const spreadArgsMetadataLength = rawParametersMetadata.filter(
      it => it.kind === ParamKind.SpreadArgs,
    ).length;
    if (spreadArgsMetadataLength > 1) {
      throw new MultipleArgsUsageError(metadata);
    }
    const singleArgMetadataLength = rawParametersMetadata.filter(
      it => it.kind === ParamKind.SingleArg,
    ).length;
    if (spreadArgsMetadataLength && singleArgMetadataLength) {
      throw new SimultaneousArgsUsageError(metadata);
    }
  }

  private buildResolveFieldMetadata(
    resolveFieldMetadata: RawResolveFieldMetadata | undefined,
  ): ResolveFieldMetadata | undefined {
    if (!resolveFieldMetadata) {
      return;
    }
    const rawResolverParametersMetadata =
      RawMetadataStorage.get().findParametersMetadata(
        resolveFieldMetadata.resolverClass,
        resolveFieldMetadata.resolverPropertyKey,
      ) ?? [];
    this.checkArgsParametersUsage(
      rawResolverParametersMetadata,
      resolveFieldMetadata,
    );
    return {
      ...resolveFieldMetadata,
      parameters: this.buildParametersMetadata(rawResolverParametersMetadata),
    };
  }
}
