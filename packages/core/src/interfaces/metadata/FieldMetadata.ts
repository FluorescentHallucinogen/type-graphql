import RawFieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import { TypeMetadata } from "@src/interfaces/metadata/common";
import ResolveFieldMetadata from "@src/interfaces/metadata/ResolveFieldMetadata";

export default interface FieldMetadata extends RawFieldMetadata, TypeMetadata {
  resolveField?: ResolveFieldMetadata;
}
