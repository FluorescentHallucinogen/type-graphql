import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import { TypeMetadata } from "@src/metadata/builder/definitions/TypeMetadata";
import {
  PropertyMetadata,
  TargetMetadata,
} from "@src/metadata/storage/definitions/common";
import TypeValue from "@src/interfaces/TypeValue";

const bannedReflectedTypes: Function[] = [Promise, Array, Object, Function];

function getReflectedType(
  kind: "property" | "method" | "param",
  metadata: PropertyMetadata & TargetMetadata,
): Function | undefined {
  switch (kind) {
    case "property": {
      return Reflect.getMetadata(
        "design:type",
        metadata.target.prototype,
        metadata.propertyKey,
      );
    }
    default:
      // TODO: implement other cases
      return undefined;
  }
}

export function getTypeMetadata(fieldMetadata: FieldMetadata): TypeMetadata {
  const explicitType = fieldMetadata.explicitTypeFn?.();
  const reflectedType = getReflectedType("property", fieldMetadata);
  if (
    !explicitType &&
    (!reflectedType || bannedReflectedTypes.includes(reflectedType))
  ) {
    throw new Error("getTypeMetadata !typeValue");
  }

  return {
    value: (explicitType ?? reflectedType) as TypeValue,
    modifiers: {
      // TODO: read from metadata and typeValue
      isArray: false,
      nullable: false,
    },
  };
}
