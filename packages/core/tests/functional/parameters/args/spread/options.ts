import "reflect-metadata";
import { Resolver, Query, Field, InputType, Args } from "@typegraphql/core";

import getPrintedQueryType from "@tests/helpers/getPrintedQueryType";

describe("parameters > args > spread > options", () => {
  it("should use explicit type from `@Field` decorator if no reflected type available", async () => {
    @InputType()
    class TestArgs {
      @Field(_type => Boolean)
      testField!: unknown;
    }
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(@Args() _args: TestArgs): string {
        return "testQuery";
      }
    }

    const printedQueryType = await getPrintedQueryType(TestResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        testQuery(testField: Boolean!): String!
      }"
    `);
  });
});
