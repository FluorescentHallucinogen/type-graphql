import createDebug from "debug";

import MetadataBuilder from "@src/metadata/builder/MetadataBuilder";
import {
  GraphQLSchema,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLFieldConfigMap,
  GraphQLOutputType,
} from "graphql";
import BuildSchemaOptions from "@src/schema/BuildSchemaOptions";
import ClassType from "@src/interfaces/ClassType";
import {
  wrapWithModifiers,
  convertTypeIfScalar,
} from "@src/schema/type-converting";
import TypeValue from "@src/interfaces/TypeValue";
import BuiltFieldMetadata from "@src/metadata/builder/definitions/FieldMetadata";
import { BuiltTypeMetadata } from "@src/metadata/builder/definitions/common";
import CannotDetermineOutputTypeError from "@src/errors/CannotDetermineOutputTypeError";
import {
  TargetMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import BuiltQueryMetadata from "@src/metadata/builder/definitions/QueryMetadata";

const debug = createDebug("@typegraphql/core:SchemaGenerator");

export default class SchemaGenerator {
  private readonly typeByClassMap = new WeakMap<ClassType, GraphQLObjectType>();
  private readonly metadataBuilder: MetadataBuilder;

  constructor(private readonly buildSchemaOptions: BuildSchemaOptions) {
    debug("created SchemaGenerator instance", buildSchemaOptions);
    this.metadataBuilder = new MetadataBuilder(buildSchemaOptions);
  }

  generateSchema(): GraphQLSchema {
    return new GraphQLSchema({
      query: this.getQueryType(),
      types: this.getOrphanedTypes(),
    });
  }

  private getQueryType(): GraphQLObjectType {
    const resolversMetadata = this.buildSchemaOptions.resolvers.map(
      resolverClass =>
        this.metadataBuilder.getResolverMetadataByClass(resolverClass),
    );
    // TODO: attach resolver metadata reference to query metadata
    const queries = ([] as BuiltQueryMetadata[]).concat(
      ...resolversMetadata.map(it => it.queries),
    );
    return new GraphQLObjectType({
      name: "Query",
      fields: queries.reduce<GraphQLFieldConfigMap<unknown, unknown, unknown>>(
        (fields, queryMetadata) => {
          fields[queryMetadata.schemaName] = {
            type: this.getGraphQLOutputType(queryMetadata),
            description: queryMetadata.description,
            // FIXME: replace with generated handler resolver
            resolve: () => "Hello World",
          };
          return fields;
        },
        {},
      ),
    });
  }

  private getOrphanedTypes(): GraphQLNamedType[] {
    return (
      this.buildSchemaOptions.orphanedTypes?.map(orphanedTypeClass =>
        this.getTypeByClass(orphanedTypeClass),
      ) ?? []
    );
  }

  private findTypeByClass(typeClass: ClassType): GraphQLObjectType | undefined {
    return this.typeByClassMap.get(typeClass);
  }

  private getTypeByClass(typeClass: ClassType): GraphQLObjectType {
    if (this.typeByClassMap.has(typeClass)) {
      return this.typeByClassMap.get(typeClass)!;
    }

    const objectTypeMetadata = this.metadataBuilder.getTypeMetadataByClass(
      typeClass,
    );

    const objectType = new GraphQLObjectType({
      name: objectTypeMetadata.schemaName,
      description: objectTypeMetadata.description,
      fields: this.getGraphQLFields(objectTypeMetadata.fields),
    });

    this.typeByClassMap.set(typeClass, objectType);
    return objectType;
  }

  private getGraphQLFields(
    fields: BuiltFieldMetadata[],
  ): GraphQLFieldConfigMap<unknown, unknown, unknown> {
    return fields.reduce<GraphQLFieldConfigMap<unknown, unknown, unknown>>(
      (fields, metadata) => {
        fields[metadata.schemaName] = {
          type: this.getGraphQLOutputType(metadata),
          description: metadata.description,
        };
        return fields;
      },
      {},
    );
  }

  private getGraphQLOutputType(
    metadata: TargetMetadata & PropertyMetadata & BuiltTypeMetadata,
  ): GraphQLOutputType {
    for (const foundType of this.searchForGraphQLOutputType(
      metadata.type.value,
    )) {
      if (foundType) {
        return wrapWithModifiers(foundType, metadata.type.modifiers);
      }
    }

    throw new CannotDetermineOutputTypeError(metadata);
  }

  private *searchForGraphQLOutputType(
    typeValue: TypeValue,
  ): Generator<GraphQLOutputType | undefined, void, void> {
    yield convertTypeIfScalar(typeValue);
    if (typeof typeValue === "function") {
      yield this.findTypeByClass(typeValue as ClassType);
    }
    if (typeValue instanceof GraphQLObjectType) {
      yield typeValue;
    }
  }
}
