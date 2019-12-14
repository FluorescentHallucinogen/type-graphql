import BuildSchemaOptions from "@src/schema/BuildSchemaOptions";
import ClassType from "@src/interfaces/ClassType";
import MetadataStorage from "@src/metadata/storage/MetadataStorage";
import BuildedObjectTypeMetadata from "@src/metadata/builder/definitions/ObjectTypeMetadata";

export default class MetadataBuilder {
  private readonly typeMetadataByClassMap = new Map<
    ClassType,
    BuildedObjectTypeMetadata
  >();
  constructor(protected readonly buildSchemaOptions: BuildSchemaOptions) {}

  getTypeMetadataByClass(typeClass: ClassType): BuildedObjectTypeMetadata {
    if (this.typeMetadataByClassMap.has(typeClass)) {
      return this.typeMetadataByClassMap.get(typeClass)!;
    }

    const objectTypeMetadata = MetadataStorage.get().findObjectTypeMetadata(
      typeClass,
    );
    if (!objectTypeMetadata) {
      throw new Error("!objectTypeMetadata");
    }

    const objectTypeFieldsMetadata = MetadataStorage.get().findFieldMetadata(
      typeClass,
    );
    if (objectTypeFieldsMetadata.length === 0) {
      throw new Error("objectTypeFieldsMetadata.length === 0");
    }

    const buildedObjectTypeMetadata: BuildedObjectTypeMetadata = {
      ...objectTypeMetadata,
      fields: objectTypeFieldsMetadata,
    };

    this.typeMetadataByClassMap.set(typeClass, buildedObjectTypeMetadata);
    return buildedObjectTypeMetadata;
  }
}
