import {
  GraphQLScalarType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLNullableType,
} from "graphql";

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

export function wrapWithModifiers<TGraphQLType extends GraphQLNullableType>(
  baseType: TGraphQLType,
): TGraphQLType | GraphQLNonNull<TGraphQLType> {
  return new GraphQLNonNull(baseType) as GraphQLNonNull<TGraphQLType>;
}
