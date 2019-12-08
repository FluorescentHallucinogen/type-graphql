import MetadataStorage from "@src/metadata/MetadataStorage";
import TypedClassDecorator from "@src/interfaces/TypedClassDecorator";
import ClassType from "@src/interfaces/ClassType";

export interface ObjectTypeOptions {
  implements?: ClassType | ClassType[];
  // TODO: extract to common types
  name?: string;
  description?: string;
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
      name: options.name ?? target.name,
      description: options.description,
      implementedInterfaceClasses,
    });
  };
}
