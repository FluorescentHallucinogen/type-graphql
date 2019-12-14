import ObjectTypeMetadata from "@src/metadata/storage/definitions/ObjectTypeMetadata";
import BuiltFieldMetadata from "@src/metadata/builder/definitions/FieldMetadata";

export default interface BuiltObjectTypeMetadata extends ObjectTypeMetadata {
  fields: BuiltFieldMetadata[];
}
