import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import { BuildedTypeMetadata } from "@src/metadata/builder/definitions/common";

export default interface BuiltFieldMetadata
  extends FieldMetadata,
    BuildedTypeMetadata {}
