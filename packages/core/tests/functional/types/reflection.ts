import "reflect-metadata";

import { ObjectType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("types > reflection", () => {
  it("should generate proper field signature in schema for string property type", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
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

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
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

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: Boolean!
      }"
    `);
  });
});
