import "reflect-metadata";
import { Resolver, Query, Args, InputType, Field } from "@typegraphql/core";
import gql from "graphql-tag";
import { execute } from "graphql";

import getPrintedQueryType from "@tests/helpers/getPrintedQueryType";
import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("parameters > args > single > basic", () => {
  it("should emit single inline arg", async () => {
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(@Args("testArg") _testArg: string): string {
        return "testQuery";
      }
    }

    const printedQueryType = await getPrintedQueryType(TestResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        testQuery(testArg: String!): String!
      }"
    `);
  });

  it("should emit multiple inline args", async () => {
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(
        @Args("firstArg") _firstArg: string,
        @Args("secondArg") _secondArg: string,
        @Args("thirdArg") _thirdArg: string,
      ): string {
        return "testQuery";
      }
    }

    const printedQueryType = await getPrintedQueryType(TestResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        testQuery(thirdArg: String!, secondArg: String!, firstArg: String!): String!
      }"
    `);
  });

  it("should emit inline arg for input type", async () => {
    @InputType()
    class TestInput {
      @Field()
      testField!: string;
    }
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(@Args("testArg") _testArg: TestInput): string {
        return "testQuery";
      }
    }

    const printedQueryType = await getPrintedQueryType(TestResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        testQuery(testArg: TestInput!): String!
      }"
    `);
  });

  it("should inject args properties to the resolver class method", async () => {
    let injectedFirstArg!: string;
    let injectedSecondArg!: string;
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(
        @Args("firstArg") firstArg: string,
        @Args("secondArg") secondArg: string,
      ): string {
        injectedFirstArg = firstArg;
        injectedSecondArg = secondArg;
        return "testQuery";
      }
    }

    const document = gql`
      query {
        testQuery(firstArg: "firstArgValue", secondArg: "secondArgValue")
      }
    `;
    const schema = await buildTestSchema({ resolvers: [TestResolver] });

    await execute({ schema, document });

    expect(injectedFirstArg).toMatchInlineSnapshot(`"firstArgValue"`);
    expect(injectedSecondArg).toMatchInlineSnapshot(`"secondArgValue"`);
  });
});
