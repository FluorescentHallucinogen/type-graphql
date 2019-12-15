import "reflect-metadata";
import { printType } from "graphql";

import { buildSchema, ObjectType, Field } from "@typegraphql/core";

describe("Fields types > symbol", () => {
  it("should should correctly generate schema field name when symbol is used as property key", async () => {
    const sampleFieldSymbol = Symbol("sampleField");
    @ObjectType()
    class SampleObject {
      @Field(_type => String)
      [sampleFieldSymbol]!: string;
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
