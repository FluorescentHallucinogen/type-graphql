import {
  TargetMetadata,
  NameMetadata,
  DescriptionMetadata,
  PropertyMetadata,
} from "@src/metadata/definitions/common";
import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";

export default interface FieldMetadata
  extends TargetMetadata,
    PropertyMetadata,
    NameMetadata,
    DescriptionMetadata {
  explicitTypeFn: ExplicitTypeFn | undefined;
}
