import "reflect-metadata";
import { printType, GraphQLScalarType } from "graphql";

import { buildSchema, ObjectType, Field } from "@typegraphql/core";

describe("Fields types", () => {
  it("should generate proper field signature in schema for explicit String type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => String)
      sampleField!: string;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String!
      }"
    `);
  });

  it("should generate proper field signature in schema for explicit Number type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => Number)
      sampleField!: number;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: Float!
      }"
    `);
  });

  it("should generate proper field signature in schema for explicit Boolean type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => Boolean)
      sampleField!: boolean;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: Boolean!
      }"
    `);
  });

  it("should generate proper field signature in schema for explicit custom scalar type", async () => {
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
});
