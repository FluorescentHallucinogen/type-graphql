import ClassType from "@src/interfaces/ClassType";
import {
  TargetMetadata,
  SchemaNameMetadata,
  DescriptionMetadata,
} from "@src/metadata/storage/definitions/common";

export default interface ObjectTypeMetadata
  extends TargetMetadata,
    SchemaNameMetadata,
    DescriptionMetadata {
  implementedInterfaceClasses: ClassType[];
}
