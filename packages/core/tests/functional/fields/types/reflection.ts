import "reflect-metadata";
import { printType } from "graphql";

import { buildSchema, ObjectType, Field } from "@typegraphql/core";

describe("Fields types > reflection", () => {
  it("should generate proper field signature in schema for string property type", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
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

  it("should generate proper field signature in schema for number property type", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
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

  it("should generate proper field signature in schema for boolean property type", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
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
});
