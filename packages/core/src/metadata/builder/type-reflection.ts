import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import TypeMetadata from "@src/metadata/builder/definitions/TypeMetadata";

export function getTypeMetadata(fieldMetadata: FieldMetadata): TypeMetadata {
  const typeValue = fieldMetadata.explicitTypeFn?.();
  if (!typeValue) {
    throw new Error("getTypeMetadata !typeValue");
  }

  return {
    value: typeValue,
    modifiers: {
      // TODO: read from metadata and typeValue
      isArray: false,
      nullable: false,
    },
  };
}
