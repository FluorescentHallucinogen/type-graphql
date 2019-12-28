import "reflect-metadata";

import { ObjectType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("Object types > base", () => {
  it("should generate schema signature with fields for basic object type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => String)
      sampleField!: string;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String!
      }"
    `);
  });
});
