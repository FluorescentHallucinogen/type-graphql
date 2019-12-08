import {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInputType,
} from "graphql";

import ClassType from "@src/interfaces/ClassType";

type RecursiveSingleTuple<TValue> = [RecursiveSingleTuple<TValue> | TValue];
type SupportedGraphQLPrimitives =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInputType;
type TypeValue = ClassType | SupportedGraphQLPrimitives | object | symbol; // enum | union
type ExplicitTypeFnValue = TypeValue | RecursiveSingleTuple<TypeValue>;

type ExplicitTypeFn = (keyword?: void) => ExplicitTypeFnValue;
export default ExplicitTypeFn;
