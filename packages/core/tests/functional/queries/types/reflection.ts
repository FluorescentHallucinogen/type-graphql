import "reflect-metadata";

import { Resolver, Query } from "@typegraphql/core";
import getPrintedQuery from "@tests/helpers/getPrintedQuery";

describe("Queries return types > reflection", () => {
  it("should generate proper schema signature for query with string return type", async () => {
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String!
      }"
    `);
  });

  it("should generate proper schema signature for query with number return type", async () => {
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): number {
        return 0;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: Float!
      }"
    `);
  });

  it("should generate proper schema signature for query with boolean return type", async () => {
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): boolean {
        return true;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: Boolean!
      }"
    `);
  });
});
