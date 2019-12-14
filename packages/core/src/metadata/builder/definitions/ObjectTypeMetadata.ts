import ObjectTypeMetadata from "@src/metadata/storage/definitions/ObjectTypeMetadata";
import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";

export default interface BuildedObjectTypeMetadata extends ObjectTypeMetadata {
  fields: FieldMetadata[];
}
