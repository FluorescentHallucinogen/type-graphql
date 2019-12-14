import "reflect-metadata";
import { printType } from "graphql";

import { buildSchema, ObjectType, Field } from "@typegraphql/core";

describe("Object types", () => {
  it("should generate proper schema signature for base object type", async () => {
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

  it("should correctly generate type name using `schemaName` decorator option", async () => {
    @ObjectType({ schemaName: "SampleObjectSchemaName" })
    class SampleObject {
      @Field(_type => String)
      sampleField!: string;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObjectSchemaName")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObjectSchemaName {
        sampleField: String!
      }"
    `);
  });

  it("should correctly generate type description using `description` decorator option", async () => {
    @ObjectType({ description: "SampleObject description" })
    class SampleObject {
      @Field(_type => String)
      sampleField!: string;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "\\"\\"\\"SampleObject description\\"\\"\\"
      type SampleObject {
        sampleField: String!
      }"
    `);
  });
});
