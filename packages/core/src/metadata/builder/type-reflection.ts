import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import { TypeMetadata } from "@src/metadata/builder/definitions/TypeMetadata";
import {
  PropertyMetadata,
  TargetMetadata,
  ExplicitTypeMetadata,
  NullableMetadata,
} from "@src/metadata/storage/definitions/common";
import TypeValue from "@src/interfaces/TypeValue";
import { ExplicitTypeFnValue } from "@src/interfaces/ExplicitTypeFn";
import MissingExplicitTypeError from "@src/errors/MissingExplicitTypeError";
import QueryMetadata from "@src/metadata/storage/definitions/QueryMetadata";

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
    case "method": {
      return Reflect.getMetadata(
        "design:returntype",
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
  explicitTypeFromFn: ExplicitTypeFnValue | undefined,
): { explicitType: TypeValue | undefined; listDepth: number } {
  let listDepth = 0;
  let currentTupleItem = explicitTypeFromFn;
  while (Array.isArray(currentTupleItem)) {
    listDepth++;
    currentTupleItem = currentTupleItem[0];
  }
  return { explicitType: currentTupleItem, listDepth };
}

function getTypeMetadata(
  metadata: TargetMetadata &
    PropertyMetadata &
    ExplicitTypeMetadata &
    NullableMetadata,
  nullableByDefault: boolean,
  reflectedType: Function | undefined,
): TypeMetadata {
  const { explicitType, listDepth } = unwrapExplicitType(
    metadata.explicitTypeFn?.(),
  );
  if (
    !explicitType &&
    (!reflectedType || bannedReflectedTypes.includes(reflectedType))
  ) {
    throw new MissingExplicitTypeError(metadata, reflectedType);
  }

  return {
    value: (explicitType ?? reflectedType) as TypeValue,
    modifiers: {
      listDepth,
      nullable: metadata.nullable ?? nullableByDefault,
    },
  };
}

export function getFieldTypeMetadata(
  fieldMetadata: FieldMetadata,
  nullableByDefault: boolean,
): TypeMetadata {
  const reflectedType = getReflectedType("property", fieldMetadata);
  return getTypeMetadata(fieldMetadata, nullableByDefault, reflectedType);
}

export function getQueryTypeMetadata(
  queryMetadata: QueryMetadata,
  nullableByDefault: boolean,
): TypeMetadata {
  const reflectedType = getReflectedType("method", queryMetadata);
  return getTypeMetadata(queryMetadata, nullableByDefault, reflectedType);
}
