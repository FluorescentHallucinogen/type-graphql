import ClassType from "@src/interfaces/ClassType";
import {
  TargetMetadata,
  NameMetadata,
  DescriptionMetadata,
} from "@src/metadata/definitions/common";

export default interface ObjectTypeMetadata
  extends TargetMetadata,
    NameMetadata,
    DescriptionMetadata {
  implementedInterfaceClasses: ClassType[];
}
