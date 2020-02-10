import "reflect-metadata";
import {
  ObjectType,
  Field,
  Resolver,
  Query,
  ResolveField,
  Args,
} from "@typegraphql/core";
import { execute } from "graphql";
import gql from "graphql-tag";

import buildTestSchema from "@tests/helpers/buildTestSchema";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("resolve field > basic", () => {
  it("should generate proper schema signature for object type when resolve field has args", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string;
    }
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(): SampleObject {
        return {} as SampleObject;
      }

      @ResolveField(
        _of => SampleObject,
        sample => sample.sampleField,
      )
      getSampleField(@Args("sampleArg") sampleArg: string): string {
        return sampleArg;
      }
    }

    const printedQueryType = await getPrintedType(SampleObject, undefined, {
      resolvers: [TestResolver],
    });

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField(sampleArg: String!): String!
      }"
    `);
  });

  it("should execute resolver class method to resolve field value", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string;
    }
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(): SampleObject {
        return {} as SampleObject;
      }

      @ResolveField(
        _of => SampleObject,
        sample => sample.sampleField,
      )
      getSampleField(): string {
        return "getSampleField";
      }
    }
    const document = gql`
      query {
        testQuery {
          sampleField
        }
      }
    `;

    const schema = await buildTestSchema({ resolvers: [TestResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "testQuery": Object {
            "sampleField": "getSampleField",
          },
        },
      }
    `);
  });

  it("should execute resolver class method injecting the args for resolve field with args", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string;
    }
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(): SampleObject {
        return {} as SampleObject;
      }

      @ResolveField(
        _of => SampleObject,
        sample => sample.sampleField,
      )
      getSampleField(@Args("sampleArg") sampleArg: string): string {
        return sampleArg;
      }
    }
    const document = gql`
      query {
        testQuery {
          sampleField(sampleArg: "sampleArgValue")
        }
      }
    `;

    const schema = await buildTestSchema({ resolvers: [TestResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "testQuery": Object {
            "sampleField": "sampleArgValue",
          },
        },
      }
    `);
  });

  it("should execute resolver class async method for resolve field", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string;
    }
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(): SampleObject {
        return {} as SampleObject;
      }

      @ResolveField(
        _of => SampleObject,
        sample => sample.sampleField,
      )
      async getSampleField(): Promise<string> {
        await new Promise(setImmediate);
        return "async getSampleField";
      }
    }
    const document = gql`
      query {
        testQuery {
          sampleField
        }
      }
    `;

    const schema = await buildTestSchema({ resolvers: [TestResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "testQuery": Object {
            "sampleField": "async getSampleField",
          },
        },
      }
    `);
  });
});
