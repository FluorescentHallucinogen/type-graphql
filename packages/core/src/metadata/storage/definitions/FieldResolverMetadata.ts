import {
  TargetClassMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import { ClassType } from "@src/interfaces";

export default interface RawResolveFieldMetadata
  extends TargetClassMetadata,
    PropertyMetadata {
  resolverClass: ClassType;
  resolverPropertyKey: string | symbol;
}
