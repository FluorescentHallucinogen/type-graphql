import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import { BuiltTypeMetadata } from "@src/metadata/builder/definitions/common";

export default interface BuiltFieldMetadata
  extends FieldMetadata,
    BuiltTypeMetadata {}
