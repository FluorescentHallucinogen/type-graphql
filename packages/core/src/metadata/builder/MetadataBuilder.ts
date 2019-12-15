import BuildSchemaOptions from "@src/schema/BuildSchemaOptions";
import ClassType from "@src/interfaces/ClassType";
import MetadataStorage from "@src/metadata/storage/MetadataStorage";
import BuiltObjectTypeMetadata from "@src/metadata/builder/definitions/ObjectTypeMetadata";
import BuiltFieldMetadata from "@src/metadata/builder/definitions/FieldMetadata";
import { getTypeMetadata } from "@src/metadata/builder/type-reflection";

export default class MetadataBuilder {
  private readonly typeMetadataByClassMap = new Map<
    ClassType,
    BuiltObjectTypeMetadata
  >();

  constructor(protected readonly buildSchemaOptions: BuildSchemaOptions) {}

  getTypeMetadataByClass(typeClass: ClassType): BuiltObjectTypeMetadata {
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

    const builtObjectTypeMetadata: BuiltObjectTypeMetadata = {
      ...objectTypeMetadata,
      fields: objectTypeFieldsMetadata.map<BuiltFieldMetadata>(
        fieldMetadata => ({
          ...fieldMetadata,
          type: getTypeMetadata(
            fieldMetadata,
            this.buildSchemaOptions.nullableByDefault,
          ),
        }),
      ),
    };

    this.typeMetadataByClassMap.set(typeClass, builtObjectTypeMetadata);
    return builtObjectTypeMetadata;
  }
}
