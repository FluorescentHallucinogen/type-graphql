import {
  GraphQLScalarType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLNullableType,
} from "graphql";
import { TypeModifiers } from "@src/metadata/builder/definitions/TypeMetadata";

export function convertTypeIfScalar(
  type: unknown,
): GraphQLScalarType | undefined {
  if (type instanceof GraphQLScalarType) {
    return type;
  }

  switch (type) {
    case String:
      return GraphQLString;
    case Boolean:
      return GraphQLBoolean;
    case Number:
      return GraphQLFloat;
    default:
      return undefined;
  }
}

type WrappedGraphQLType<TGraphQLType extends GraphQLNullableType> =
  | TGraphQLType
  | GraphQLNonNull<TGraphQLType>;

export function wrapWithModifiers<TGraphQLType extends GraphQLNullableType>(
  baseType: TGraphQLType,
  modifiers: TypeModifiers,
): WrappedGraphQLType<TGraphQLType> {
  let graphQLType: WrappedGraphQLType<TGraphQLType> = baseType;
  if (modifiers.nullable === false) {
    graphQLType = new GraphQLNonNull(baseType) as GraphQLNonNull<TGraphQLType>;
  }
  return graphQLType;
}
