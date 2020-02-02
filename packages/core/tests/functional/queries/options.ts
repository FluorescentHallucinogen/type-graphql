import "reflect-metadata";

import { Resolver, Query } from "@typegraphql/core";
import getPrintedQueryType from "@tests/helpers/getPrintedQueryType";

describe("queries > options", () => {
  it("should correctly generate query field name using `schemaName` decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Query({ schemaName: "sampleQuerySchemaName" })
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    const printedQueryType = await getPrintedQueryType(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuerySchemaName: String!
      }"
    `);
  });

  it("should correctly generate query field description using `description` decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Query({ description: "sampleQuery description" })
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    const printedQueryType = await getPrintedQueryType(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        \\"\\"\\"sampleQuery description\\"\\"\\"
        sampleQuery: String!
      }"
    `);
  });

  it("should correctly generate query field nullable type using `nullable` decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => String, { nullable: true })
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    const printedQueryType = await getPrintedQueryType(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String
      }"
    `);
  });

  it("should correctly generate query field type using `typeFn` decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Query({ typeFn: () => [String] })
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    const printedQueryType = await getPrintedQueryType(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: [String!]!
      }"
    `);
  });

  it("should correctly generate query field type using explicit type decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => [String])
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    const printedQueryType = await getPrintedQueryType(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: [String!]!
      }"
    `);
  });
});
