import createDebug from "debug";

import ClassType from "@src/interfaces/ClassType";
import ObjectTypeMetadata from "@src/metadata/storage/definitions/ObjectTypeMetadata";
import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import ResolverMetadata from "@src/metadata/storage/definitions/ResolverMetadata";

const debug = createDebug("@typegraphql/core:MetadataStorage");

export default class MetadataStorage {
  protected objectTypesMetadataMap = new WeakMap<
    ClassType,
    ObjectTypeMetadata
  >();
  protected fieldsMetadataMap = new WeakMap<ClassType, FieldMetadata[]>();
  protected resolversMetadataMap = new WeakMap<ClassType, ResolverMetadata>();

  protected constructor() {
    debug("created MetadataStorage instance");
  }

  static get(): MetadataStorage {
    if (!global.TypeGraphQLMetadataStorage) {
      global.TypeGraphQLMetadataStorage = new MetadataStorage();
    }
    return global.TypeGraphQLMetadataStorage;
  }

  collectObjectTypeMetadata(metadata: ObjectTypeMetadata): void {
    // TODO: maybe check with `.has` to prevent duplicates?
    this.objectTypesMetadataMap.set(metadata.target, metadata);
  }
  findObjectTypeMetadata(typeClass: ClassType): ObjectTypeMetadata | undefined {
    return this.objectTypesMetadataMap.get(typeClass);
  }

  collectFieldMetadata(metadata: FieldMetadata): void {
    this.fieldsMetadataMap.set(metadata.target, [
      ...(this.fieldsMetadataMap.get(metadata.target) ?? []),
      metadata,
    ]);
  }
  findFieldMetadata(typeClass: ClassType): FieldMetadata[] | undefined {
    return this.fieldsMetadataMap.get(typeClass);
  }

  collectResolverMetadata(metadata: ResolverMetadata): void {
    this.resolversMetadataMap.set(metadata.target, metadata);
  }
  findResolverMetadata(typeClass: ClassType): ResolverMetadata | undefined {
    return this.resolversMetadataMap.get(typeClass);
  }
}
