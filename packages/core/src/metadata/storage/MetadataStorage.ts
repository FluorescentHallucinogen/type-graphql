import ObjectTypeMetadata from "@src/metadata/storage/definitions/ObjectTypeMetadata";
import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import ClassType from "@src/interfaces/ClassType";

export default class MetadataStorage {
  protected objectTypesMetadata: ObjectTypeMetadata[] = [];
  protected fieldsMetadata: FieldMetadata[] = [];

  protected constructor() {}

  static get(): MetadataStorage {
    if (!global.TypeGraphQLMetadataStorage) {
      global.TypeGraphQLMetadataStorage = new MetadataStorage();
    }
    return global.TypeGraphQLMetadataStorage;
  }

  collectObjectTypeMetadata(metadata: ObjectTypeMetadata): void {
    this.objectTypesMetadata.push(metadata);
  }
  findObjectTypeMetadata(typeClass: ClassType): ObjectTypeMetadata | undefined {
    return this.objectTypesMetadata.find(it => it.target === typeClass);
  }

  collectFieldMetadata(metadata: FieldMetadata): void {
    this.fieldsMetadata.push(metadata);
  }
  findFieldMetadata(typeClass: ClassType): FieldMetadata[] {
    return this.fieldsMetadata.filter(it => it.target === typeClass);
  }
}
