import "reflect-metadata";
import { Resolver, Query, Field, InputType, Args } from "@typegraphql/core";
import { execute } from "graphql";
import gql from "graphql-tag";

import getPrintedQueryType from "@tests/helpers/getPrintedQueryType";
import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("parameters > args > spread > basic", () => {
  it("should emit args from input type class", async () => {
    @InputType()
    class TestArgs {
      @Field()
      firstField!: string;

      @Field()
      secondField!: string;
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
        testQuery(firstField: String!, secondField: String!): String!
      }"
    `);
  });

  it("should inject args object to the resolver method", async () => {
    let injectedArgs!: TestArgs;
    @InputType()
    class TestArgs {
      @Field()
      testField!: string;
    }
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(@Args() args: TestArgs): string {
        injectedArgs = args;
        return "testQuery";
      }
    }
    const document = gql`
      query {
        testQuery(testField: "testFieldValue")
      }
    `;
    const schema = await buildTestSchema({ resolvers: [TestResolver] });

    await execute({ schema, document });

    expect(injectedArgs).toMatchInlineSnapshot(`
      Object {
        "testField": "testFieldValue",
      }
    `);
  });
});
