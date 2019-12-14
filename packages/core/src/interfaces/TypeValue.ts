import {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInputType,
} from "graphql";

import ClassType from "@src/interfaces/ClassType";

type SupportedGraphQLPrimitives =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInputType;

type TypeValue = ClassType | SupportedGraphQLPrimitives | object | symbol; // enum | union

export default TypeValue;
