import "reflect-metadata";

import { ObjectType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("Fields types > symbol", () => {
  it("should should correctly generate schema field name when symbol is used as property key", async () => {
    const sampleFieldSymbol = Symbol("sampleField");
    @ObjectType()
    class SampleObject {
      @Field(_type => String)
      [sampleFieldSymbol]!: string;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String!
      }"
    `);
  });
});
