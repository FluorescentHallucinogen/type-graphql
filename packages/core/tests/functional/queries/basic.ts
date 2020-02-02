import "reflect-metadata";
import gql from "graphql-tag";
import { execute } from "graphql";

import { Resolver, Query, Args } from "@typegraphql/core";
import getPrintedQueryType from "@tests/helpers/getPrintedQueryType";
import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("queries > basic", () => {
  it("should generate proper schema signature for basic resolver with query with args", async () => {
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@Args("sampleArg") _sampleArg: string): string {
        return "sampleQuery";
      }
    }

    const printedQueryType = await getPrintedQueryType(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery(sampleArg: String!): String!
      }"
    `);
  });

  it("should execute resolver class method for basic query with args", async () => {
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@Args("sampleArg") sampleArg: string): string {
        return sampleArg;
      }
    }
    const document = gql`
      query {
        sampleQuery(sampleArg: "sampleArgValue")
      }
    `;

    const schema = await buildTestSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "sampleQuery": "sampleArgValue",
        },
      }
    `);
  });

  it("should execute resolver class async method for query", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => String)
      async sampleQuery(): Promise<string> {
        await new Promise(setImmediate);
        return "asyncSampleQueryReturnedValue";
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;

    const schema = await buildTestSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "sampleQuery": "asyncSampleQueryReturnedValue",
        },
      }
    `);
  });
});
