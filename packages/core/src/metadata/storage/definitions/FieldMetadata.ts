import {
  TargetMetadata,
  SchemaNameMetadata,
  DescriptionMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";

export default interface FieldMetadata
  extends TargetMetadata,
    PropertyMetadata,
    SchemaNameMetadata,
    DescriptionMetadata {
  explicitTypeFn: ExplicitTypeFn | undefined;
}
