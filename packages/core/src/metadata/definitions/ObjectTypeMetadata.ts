import ClassType from "@src/interfaces/ClassType";
import { TargetMetadata } from "@src/metadata/definitions/common";

export default interface ObjectTypeMetadata extends TargetMetadata {
  implementedInterfaceClasses: ClassType[];
  // TODO: extract to common metadata interfaces
  name: string;
  description: string | undefined;
}
