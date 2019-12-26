import {
  TargetMetadata,
  SchemaNameMetadata,
  DescriptionMetadata,
  PropertyMetadata,
  NullableMetadata,
} from "@src/metadata/storage/definitions/common";
import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";

export default interface FieldMetadata
  extends TargetMetadata,
    PropertyMetadata,
    SchemaNameMetadata,
    NullableMetadata,
    DescriptionMetadata {
  // TODO: move to common
  explicitTypeFn: ExplicitTypeFn | undefined;
}
