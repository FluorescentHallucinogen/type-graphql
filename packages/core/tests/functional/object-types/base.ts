import "reflect-metadata";
import { printType } from "graphql";

import { buildSchema, ObjectType, Field } from "@typegraphql/core";

describe("Object types > base", () => {
  it("should generate schema signature with fields for basic object type", async () => {
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
});
