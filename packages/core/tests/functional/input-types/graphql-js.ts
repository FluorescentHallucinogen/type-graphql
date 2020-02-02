import "reflect-metadata";
import {
  GraphQLScalarType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
} from "graphql";

import { Field, InputType } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("input types > GraphQL-JS interoperability", () => {
  it("should generate proper field signature in schema for explicit GraphQLScalarType", async () => {
    const CustomScalar = new GraphQLScalarType({
      name: "CustomScalar",
      serialize: it => it,
    });
    @InputType()
    class SampleInput {
      @Field(_type => CustomScalar)
      sampleField!: string;
    }

    const printedSampleInputType = await getPrintedType(SampleInput);

    expect(printedSampleInputType).toMatchInlineSnapshot(`
      "input SampleInput {
        sampleField: CustomScalar!
      }"
    `);
  });

  it("should generate proper field signature in schema for explicit GraphQLInputObjectType", async () => {
    const CustomGraphQLInputObjectType = new GraphQLInputObjectType({
      name: "CustomGraphQLInputObjectType",
      fields: {
        customSampleField: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
    });
    @InputType()
    class SampleInput {
      @Field(_type => CustomGraphQLInputObjectType)
      sampleField!: unknown;
    }

    const printedSampleInputType = await getPrintedType(SampleInput);

    expect(printedSampleInputType).toMatchInlineSnapshot(`
      "input SampleInput {
        sampleField: CustomGraphQLInputObjectType!
      }"
    `);
  });
});
