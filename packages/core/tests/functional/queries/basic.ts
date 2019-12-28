import "reflect-metadata";
import { printType } from "graphql";

import { buildSchema, Resolver, Query } from "@typegraphql/core";

describe("Queries > basic", () => {
  it("should generate proper schema signature for basic resolver with query", async () => {
    @Resolver()
    class SampleResolver {
      // TODO: remove explicit type when reflection done
      @Query(_returns => String)
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    const schema = await buildSchema({
      resolvers: [SampleResolver],
    });
    const queryType = schema.getQueryType()!;

    expect(printType(queryType)).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String!
      }"
    `);
  });
});
