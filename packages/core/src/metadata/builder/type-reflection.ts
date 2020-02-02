import RawFieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import { TypeInfo } from "@src/interfaces/metadata/TypeMetadata";
import {
  PropertyMetadata,
  TargetClassMetadata,
  ExplicitTypeMetadata,
  NullableMetadata,
} from "@src/metadata/storage/definitions/common";
import TypeValue from "@src/interfaces/TypeValue";
import { ExplicitTypeFnValue } from "@src/interfaces/ExplicitTypeFn";
import MissingExplicitTypeError, {
  MissingExplicitTypeDecoratorKind,
} from "@src/errors/MissingExplicitTypeError";
import RawQueryMetadata from "@src/metadata/storage/definitions/QueryMetadata";
import RawSpreadArgsParameterMetadata from "@src/metadata/storage/definitions/parameters/SpreadArgsParameterMetadata";
import RawSingleArgParameterMetadata from "@src/metadata/storage/definitions/parameters/SingleArgParamterMetadata";
import RawParameterMetadata from "@src/metadata/storage/definitions/parameters/ParameterMetadata";

const bannedReflectedTypes: Function[] = [Promise, Array, Object, Function];

function getReflectedPropertyType(
  metadata: PropertyMetadata & TargetClassMetadata,
): Function | undefined {
  return Reflect.getMetadata(
    "design:type",
    metadata.targetClass.prototype,
    metadata.propertyKey,
  );
}
function getReflectedMethodType(
  metadata: PropertyMetadata & TargetClassMetadata,
): Function | undefined {
  return Reflect.getMetadata(
    "design:returntype",
    metadata.targetClass.prototype,
    metadata.propertyKey,
  );
}

function getReflectedParameterType(
  metadata: RawParameterMetadata,
): Function | undefined {
  const parametersTypes = Reflect.getMetadata(
    "design:paramtypes",
    metadata.targetClass.prototype,
    metadata.propertyKey,
  );
  return parametersTypes?.[metadata.parameterIndex];
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
  metadata: TargetClassMetadata &
    PropertyMetadata &
    ExplicitTypeMetadata &
    NullableMetadata &
    Partial<RawParameterMetadata>,
  nullableByDefault: boolean,
  reflectedType: Function | undefined,
  kind: MissingExplicitTypeDecoratorKind,
): TypeInfo {
  const { explicitType, listDepth } = unwrapExplicitType(
    metadata.explicitTypeFn?.(),
  );
  if (
    !explicitType &&
    (!reflectedType || bannedReflectedTypes.includes(reflectedType))
  ) {
    throw new MissingExplicitTypeError(metadata, reflectedType, kind);
  }

  return {
    value: (explicitType ?? reflectedType) as TypeValue,
    modifiers: {
      listDepth,
      nullable: metadata.nullable ?? nullableByDefault,
    },
  };
}

export function getPropertyTypeMetadata(
  fieldMetadata: RawFieldMetadata,
  nullableByDefault: boolean,
): TypeInfo {
  const reflectedType = getReflectedPropertyType(fieldMetadata);
  return getTypeMetadata(
    fieldMetadata,
    nullableByDefault,
    reflectedType,
    "Field",
  );
}

export function getMethodTypeMetadata(
  queryMetadata: RawQueryMetadata,
  nullableByDefault: boolean,
  kind: "Query" | "Mutation",
): TypeInfo {
  const reflectedType = getReflectedMethodType(queryMetadata);
  return getTypeMetadata(queryMetadata, nullableByDefault, reflectedType, kind);
}

export function getMethodParameterTypeMetadata(
  parameterMetadata:
    | RawSingleArgParameterMetadata
    | RawSpreadArgsParameterMetadata,
  nullableByDefault: boolean,
): TypeInfo {
  const reflectedType = getReflectedParameterType(parameterMetadata);
  return getTypeMetadata(
    parameterMetadata,
    nullableByDefault,
    reflectedType,
    "Args",
  );
}
