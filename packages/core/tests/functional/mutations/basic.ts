import "reflect-metadata";
import gql from "graphql-tag";
import { execute } from "graphql";

import { Resolver, Mutation, Args } from "@typegraphql/core";
import getPrintedMutationType from "@tests/helpers/getPrintedMutationType";
import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("mutations > basic", () => {
  it("should generate proper schema signature for basic resolver with mutation with args", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation()
      sampleMutation(@Args("sampleArg") _sampleArg: string): string {
        return "sampleMutation";
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation(sampleArg: String!): String!
      }"
    `);
  });

  it("should execute resolver class method for mutation with args", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation()
      sampleMutation(@Args("sampleArg") sampleArg: string): string {
        return sampleArg;
      }
    }
    const document = gql`
      mutation {
        sampleMutation(sampleArg: "sampleArgValue")
      }
    `;

    const schema = await buildTestSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "sampleMutation": "sampleArgValue",
        },
      }
    `);
  });

  it("should execute resolver class async method for mutation", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation(_returns => String)
      async sampleMutation(): Promise<string> {
        await new Promise(setImmediate);
        return "asyncSampleMutationReturnedValue";
      }
    }
    const document = gql`
      mutation {
        sampleMutation
      }
    `;

    const schema = await buildTestSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "sampleMutation": "asyncSampleMutationReturnedValue",
        },
      }
    `);
  });
});
