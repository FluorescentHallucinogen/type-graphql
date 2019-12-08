import ObjectTypeMetadata from "@src/metadata/definitions/ObjectTypeMetadata";

export default class MetadataStorage {
  protected objectTypesMetadata: ObjectTypeMetadata[] = [];

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
}
