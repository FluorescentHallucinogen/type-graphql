import "reflect-metadata";

import { ObjectType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("types > explicitTypeFn", () => {
  it("should generate proper field signature in schema for explicit String type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => String)
      sampleField!: unknown;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String!
      }"
    `);
  });

  it("should generate proper field signature in schema for explicit Number type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => Number)
      sampleField!: unknown;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: Float!
      }"
    `);
  });

  it("should generate proper field signature in schema for explicit Boolean type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => Boolean)
      sampleField!: unknown;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: Boolean!
      }"
    `);
  });

  it("should generate proper field signature in schema for explicit string array type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => [String])
      sampleField!: unknown;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: [String!]!
      }"
    `);
  });

  it("should generate proper field signature in schema for nested string array type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => [[[String]]])
      sampleField!: unknown;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: [[[String!]!]!]!
      }"
    `);
  });

  it("should generate proper field signature in schema when using explicit String type in options", async () => {
    @ObjectType()
    class SampleObject {
      @Field({ typeFn: () => String })
      sampleField!: unknown;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String!
      }"
    `);
  });
});
