import MetadataStorage from "@src/metadata/storage/MetadataStorage";
import TypedClassDecorator from "@src/interfaces/TypedClassDecorator";
import ClassType from "@src/interfaces/ClassType";
import { Nameable, Descriptionable } from "@src/decorators/types";

export interface ObjectTypeOptions extends Nameable, Descriptionable {
  implements?: ClassType | ClassType[];
}

export default function ObjectType(
  options: ObjectTypeOptions = {},
): TypedClassDecorator {
  const implementedInterfaceClasses: ClassType[] = [];
  if (options.implements) {
    implementedInterfaceClasses.concat(options.implements);
  }

  return target => {
    MetadataStorage.get().collectObjectTypeMetadata({
      target,
      schemaName: options.schemaName ?? target.name,
      description: options.description,
      implementedInterfaceClasses,
    });
  };
}
