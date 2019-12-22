import ObjectTypeMetadata from "@src/metadata/storage/definitions/ObjectTypeMetadata";
import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import ClassType from "@src/interfaces/ClassType";

export default class MetadataStorage {
  protected objectTypesMetadataMap = new WeakMap<
    ClassType,
    ObjectTypeMetadata
  >();
  protected fieldsMetadataMap = new WeakMap<ClassType, FieldMetadata[]>();

  protected constructor() {}

  static get(): MetadataStorage {
    if (!global.TypeGraphQLMetadataStorage) {
      global.TypeGraphQLMetadataStorage = new MetadataStorage();
    }
    return global.TypeGraphQLMetadataStorage;
  }

  collectObjectTypeMetadata(metadata: ObjectTypeMetadata): void {
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
}
