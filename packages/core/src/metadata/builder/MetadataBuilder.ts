import createDebug from "debug";

import BuildSchemaOptions from "@src/schema/BuildSchemaOptions";
import ClassType from "@src/interfaces/ClassType";
import MetadataStorage from "@src/metadata/storage/MetadataStorage";
import BuiltObjectTypeMetadata from "@src/metadata/builder/definitions/ObjectTypeMetadata";
import BuiltFieldMetadata from "@src/metadata/builder/definitions/FieldMetadata";
import {
  getFieldTypeMetadata,
  getQueryTypeMetadata,
} from "@src/metadata/builder/type-reflection";
import MissingClassMetadataError from "@src/errors/MissingClassMetadataError";
import MissingFieldsError from "@src/errors/MissingFieldsError";
import BuiltResolverMetadata from "@src/metadata/builder/definitions/ResolverMetadata";
import BuiltQueryMetadata from "@src/metadata/builder/definitions/QueryMetadata";

const debug = createDebug("@typegraphql/core:MetadataBuilder");

export default class MetadataBuilder {
  private readonly typeMetadataByClassMap = new WeakMap<
    ClassType,
    BuiltObjectTypeMetadata
  >();
  private readonly resolverMetadataByClassMap = new WeakMap<
    ClassType,
    BuiltResolverMetadata
  >();

  constructor(protected readonly buildSchemaOptions: BuildSchemaOptions) {
    debug("created MetadataBuilder instance", buildSchemaOptions);
  }

  getTypeMetadataByClass(typeClass: ClassType): BuiltObjectTypeMetadata {
    if (this.typeMetadataByClassMap.has(typeClass)) {
      return this.typeMetadataByClassMap.get(typeClass)!;
    }

    const objectTypeMetadata = MetadataStorage.get().findObjectTypeMetadata(
      typeClass,
    );
    if (!objectTypeMetadata) {
      throw new MissingClassMetadataError(typeClass, "ObjectType");
    }

    const objectTypeFieldsMetadata = MetadataStorage.get().findFieldsMetadata(
      typeClass,
    );
    if (!objectTypeFieldsMetadata || objectTypeFieldsMetadata.length === 0) {
      throw new MissingFieldsError(typeClass);
    }

    const builtObjectTypeMetadata: BuiltObjectTypeMetadata = {
      ...objectTypeMetadata,
      fields: objectTypeFieldsMetadata.map<BuiltFieldMetadata>(
        fieldMetadata => ({
          ...fieldMetadata,
          type: getFieldTypeMetadata(
            fieldMetadata,
            this.buildSchemaOptions.nullableByDefault,
          ),
        }),
      ),
    };

    this.typeMetadataByClassMap.set(typeClass, builtObjectTypeMetadata);
    return builtObjectTypeMetadata;
  }

  getResolverMetadataByClass(typeClass: ClassType): BuiltResolverMetadata {
    if (this.resolverMetadataByClassMap.has(typeClass)) {
      return this.resolverMetadataByClassMap.get(typeClass)!;
    }

    const resolverMetadata = MetadataStorage.get().findResolverMetadata(
      typeClass,
    );
    if (!resolverMetadata) {
      throw new Error("TODO: proper message");
    }

    const queriesMetadata = MetadataStorage.get().findQueriesMetadata(
      typeClass,
    );
    if (!queriesMetadata || queriesMetadata.length === 0) {
      throw new Error("TODO: proper message");
    }

    const builtResolverMetadata: BuiltResolverMetadata = {
      ...resolverMetadata,
      queries: queriesMetadata.map<BuiltQueryMetadata>(queryMetadata => ({
        ...queryMetadata,
        type: getQueryTypeMetadata(
          queryMetadata,
          this.buildSchemaOptions.nullableByDefault,
        ),
      })),
    };

    this.resolverMetadataByClassMap.set(typeClass, builtResolverMetadata);
    return builtResolverMetadata;
  }
}
