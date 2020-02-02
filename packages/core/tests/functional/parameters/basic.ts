import "reflect-metadata";
import gql from "graphql-tag";
import { execute, GraphQLResolveInfo } from "graphql";

import { Resolver, Query, Source, Context, Info } from "@typegraphql/core";
import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("parameters > basic", () => {
  it("should inject multiple parameters to a resolver method in a correct order", async () => {
    interface TestContext {
      pi: number;
    }
    let injectedResolveInfo!: GraphQLResolveInfo;
    let injectedContext!: TestContext;
    let injectedRootValue!: number;
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(
        @Info() info: GraphQLResolveInfo,
        @Context() context: TestContext,
        @Source() source: number,
      ): boolean {
        injectedResolveInfo = info;
        injectedContext = context;
        injectedRootValue = source;
        return true;
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;
    const contextValue: TestContext = { pi: Math.PI };
    const rootValue = Math.PI;

    const schema = await buildTestSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document, rootValue, contextValue });

    expect(result.errors).toBeUndefined();
    expect(result.data?.sampleQuery).toBeTrue();
    expect(Object.keys(injectedResolveInfo)).toMatchInlineSnapshot(`
      Array [
        "fieldName",
        "fieldNodes",
        "returnType",
        "parentType",
        "path",
        "schema",
        "fragments",
        "rootValue",
        "operation",
        "variableValues",
      ]
    `);
    expect(injectedContext).toMatchInlineSnapshot(`
      Object {
        "pi": 3.141592653589793,
      }
    `);
    expect(injectedRootValue).toMatchInlineSnapshot(`3.141592653589793`);
  });

  it("should inject parameters to a proper resolver method in case of multiple methods", async () => {
    @Resolver()
    class SampleResolver {
      @Query()
      firstSampleQuery(@Source() source: number): number {
        return source;
      }

      @Query()
      secondSampleQuery(@Info() _info: GraphQLResolveInfo): boolean {
        return true;
      }
    }
    const document = gql`
      query {
        firstSampleQuery
      }
    `;
    const rootValue = Math.PI;

    const schema = await buildTestSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document, rootValue });

    expect(result.errors).toBeUndefined();
    expect(result.data?.firstSampleQuery).toBe(rootValue);
  });
});
