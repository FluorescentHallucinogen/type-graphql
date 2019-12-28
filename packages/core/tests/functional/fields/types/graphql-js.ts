import "reflect-metadata";
import {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { ObjectType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("Fields types > GraphQL-JS interoperability", () => {
  it("should generate proper field signature in schema for explicit GraphQLScalarType", async () => {
    const CustomScalar = new GraphQLScalarType({
      name: "CustomScalar",
      serialize: it => it,
    });
    @ObjectType()
    class SampleObject {
      @Field(_type => CustomScalar)
      sampleField!: string;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: CustomScalar!
      }"
    `);
  });

  it("should generate proper field signature in schema for explicit GraphQLObjectType", async () => {
    const CustomGraphQLObjectType = new GraphQLObjectType({
      name: "CustomGraphQLObjectType",
      fields: {
        customSampleField: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
    });
    @ObjectType()
    class SampleObject {
      @Field(_type => CustomGraphQLObjectType)
      sampleField!: unknown;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: CustomGraphQLObjectType!
      }"
    `);
  });
});
