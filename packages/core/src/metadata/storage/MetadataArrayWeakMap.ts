import { TargetClassMetadata } from "@src/metadata/storage/definitions/common";
import ClassType from "@src/interfaces/ClassType";

export default class MetadataArrayWeakMap<
  TMetadata extends TargetClassMetadata
> {
  private readonly metadataMap = new WeakMap<ClassType, readonly TMetadata[]>();

  collect(metadata: TMetadata): void {
    // TODO: how to prevent duplicates?
    this.metadataMap.set(metadata.targetClass, [
      ...(this.find(metadata.targetClass) ?? []),
      metadata,
    ]);
  }

  find(typeClass: ClassType): readonly TMetadata[] | undefined {
    return this.metadataMap.get(typeClass);
  }
}
