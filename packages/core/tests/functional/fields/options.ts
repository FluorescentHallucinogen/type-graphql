import "reflect-metadata";
import { printType } from "graphql";

import { buildSchema, ObjectType, Field } from "@typegraphql/core";

describe("@Field options", () => {
  it("should correctly generate field name in schema using `schemaName` decorator option", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => String, { schemaName: "sampleFieldSchemaName" })
      sampleField!: string;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleFieldSchemaName: String!
      }"
    `);
  });

  it("should correctly generate field description in schema using `description` decorator option", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => String, { description: "Field description" })
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
});
