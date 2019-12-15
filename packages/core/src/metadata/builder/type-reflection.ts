import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import { TypeMetadata } from "@src/metadata/builder/definitions/TypeMetadata";
import {
  PropertyMetadata,
  TargetMetadata,
} from "@src/metadata/storage/definitions/common";
import TypeValue from "@src/interfaces/TypeValue";
import { ExplicitTypeFnValue } from "@src/interfaces/ExplicitTypeFn";

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

function unwrapExplicitType(
  explicitType: ExplicitTypeFnValue | undefined,
): { explicitInnerType: TypeValue | undefined; listDepth: number } {
  let listDepth = 0;
  let currentTupleItem = explicitType;
  while (Array.isArray(currentTupleItem)) {
    listDepth++;
    currentTupleItem = currentTupleItem[0];
  }
  return { explicitInnerType: currentTupleItem, listDepth };
}

export function getTypeMetadata(
  fieldMetadata: FieldMetadata,
  nullableByDefault: boolean | undefined,
): TypeMetadata {
  const explicitType = fieldMetadata.explicitTypeFn?.();
  const { explicitInnerType, listDepth } = unwrapExplicitType(explicitType);
  const reflectedType = getReflectedType("property", fieldMetadata);
  if (
    !explicitType &&
    (!reflectedType || bannedReflectedTypes.includes(reflectedType))
  ) {
    throw new Error("getTypeMetadata !typeValue");
  }

  return {
    value: (explicitInnerType ?? explicitType ?? reflectedType) as TypeValue,
    modifiers: {
      listDepth,
      nullable: fieldMetadata.nullable ?? nullableByDefault ?? false,
    },
  };
}
