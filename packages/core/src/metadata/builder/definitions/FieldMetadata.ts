import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import TypeMetadata from "@src/metadata/builder/definitions/TypeMetadata";

export default interface BuiltFieldMetadata extends FieldMetadata {
  type: TypeMetadata;
}
