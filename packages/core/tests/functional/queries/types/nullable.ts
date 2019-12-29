import "reflect-metadata";

import { Resolver, Query } from "@typegraphql/core";
import getPrintedQuery from "@tests/helpers/getPrintedQuery";

describe("Queries return types > nullable", () => {
  it("should correctly generate nullable type in schema using `nullable: true` decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => String, { nullable: true })
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String
      }"
    `);
  });

  it("should correctly generate nullable type in schema using `nullableByDefault: true` build schema option", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => String)
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver, {
      nullableByDefault: true,
    });

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String
      }"
    `);
  });

  it("should correctly generate not nullable type in schema when `nullableByDefault: true` and `nullable: false`", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => String, { nullable: false })
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver, {
      nullableByDefault: true,
    });

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String!
      }"
    `);
  });

  it("should generate proper type signature in schema for nullable string array type", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => [String], { nullable: true })
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: [String]
      }"
    `);
  });

  it("should generate proper type signature in schema for nullable nested string array type", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => [[[String]]], { nullable: true })
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: [[[String]]]
      }"
    `);
  });
});
