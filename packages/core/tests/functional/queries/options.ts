import "reflect-metadata";

import { Resolver, Query } from "@typegraphql/core";
import getPrintedQuery from "@tests/helpers/getPrintedQuery";

describe("Queries > options", () => {
  it("should correctly generate query field name using `schemaName` decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Query({ schemaName: "sampleQuerySchemaName" })
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

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

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        \\"\\"\\"sampleQuery description\\"\\"\\"
        sampleQuery: String!
      }"
    `);
  });
});
