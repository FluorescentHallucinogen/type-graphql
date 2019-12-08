import ObjectTypeMetadata from "@src/metadata/definitions/ObjectTypeMetadata";
import FieldMetadata from "@src/metadata/definitions/FieldMetadata";

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
  collectFieldMetadata(metadata: FieldMetadata): void {
    this.fieldsMetadata.push(metadata);
  }
}
