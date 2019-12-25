import "reflect-metadata";
import {
  printType,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { buildSchema, ObjectType, Field } from "@typegraphql/core";

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

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
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

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: CustomGraphQLObjectType!
      }"
    `);
  });
});
