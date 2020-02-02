import "reflect-metadata";
import gql from "graphql-tag";
import { execute } from "graphql";

import {
  Resolver,
  Query,
  createParamDecorator,
  ParameterResolver,
  ResolverData,
  ParameterMetadata,
} from "@typegraphql/core";
import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("parameters > custom", () => {
  it("should inject async parameter to resolver method from custom parameter resolver", async () => {
    function TestParam(): ParameterDecorator {
      return createParamDecorator(
        class TestParamResolver implements ParameterResolver {
          async resolve(): Promise<number> {
            await new Promise(setImmediate);
            return Math.PI;
          }
        },
      );
    }
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@TestParam() testValue: number): number {
        return testValue;
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;

    const schema = await buildTestSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document });

    expect(result.errors).toBeUndefined();
    expect(result.data?.sampleQuery).toBe(Math.PI);
  });

  it("should inject resolver data and parameter metadata into ParameterResolver resolve method", async () => {
    let injectedResolverData!: ResolverData;
    let injectedMetadata!: ParameterMetadata;
    function TestParam(): ParameterDecorator {
      return createParamDecorator(
        class TestParamResolver implements ParameterResolver {
          resolve(
            resolverData: ResolverData,
            metadata: ParameterMetadata,
          ): boolean {
            injectedResolverData = resolverData;
            injectedMetadata = metadata;
            return true;
          }
        },
      );
    }
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@TestParam() testValue: boolean): boolean {
        return testValue;
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;
    const rootValue = Math.PI;
    const contextValue = { value: Math.PI };

    const schema = await buildTestSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document, rootValue, contextValue });

    expect(result.errors).toBeUndefined();
    expect(Object.keys(injectedResolverData)).toMatchInlineSnapshot(`
      Array [
        "source",
        "args",
        "context",
        "info",
      ]
    `);
    expect(injectedMetadata).toMatchInlineSnapshot(`
      Object {
        "kind": 0,
        "parameterIndex": 0,
        "parameterResolverClass": [Function],
        "propertyKey": "sampleQuery",
        "targetClass": [Function],
      }
    `);
  });
});
