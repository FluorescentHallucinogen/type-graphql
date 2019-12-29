import "reflect-metadata";

import { Query, Resolver } from "@typegraphql/core";
import getPrintedQuery from "@tests/helpers/getPrintedQuery";

describe("Queries return types > explicitTypeFn", () => {
  it("should generate proper schema signature for query with explicit String type", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => String)
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String!
      }"
    `);
  });

  it("should generate proper schema signature for query with explicit Number type", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => Number)
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: Float!
      }"
    `);
  });

  it("should generate proper schema signature for query with explicit Boolean type", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => Boolean)
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: Boolean!
      }"
    `);
  });

  it("should generate proper schema signature for query with explicit string array type", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => [String])
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: [String!]!
      }"
    `);
  });

  it("should generate proper schema signature for query with nested string array type", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => [[[String]]])
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: [[[String!]!]!]!
      }"
    `);
  });

  it("should generate proper field signature in schema when using explicit String type in options", async () => {
    @Resolver()
    class SampleResolver {
      @Query({ typeFn: () => String })
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String!
      }"
    `);
  });
});
