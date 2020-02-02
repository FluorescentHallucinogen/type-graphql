import "reflect-metadata";
import {
  GraphQLScalarType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
} from "graphql";

import { Resolver, Mutation, Args } from "@typegraphql/core";
import getPrintedMutationType from "@tests/helpers/getPrintedMutationType";

describe("parameters > args > single > GraphQL-JS interoperability", () => {
  it("should generate proper schema signature for mutation argument with explicit GraphQLScalarType", async () => {
    const CustomScalar = new GraphQLScalarType({
      name: "CustomScalar",
      serialize: it => it,
    });
    @Resolver()
    class SampleResolver {
      @Mutation()
      sampleMutation(
        @Args("sampleArg", { typeFn: () => CustomScalar })
        _sampleArg: unknown,
      ): string {
        return "sampleMutation";
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation(sampleArg: CustomScalar!): String!
      }"
    `);
  });

  it("should generate proper schema signature for mutation argument with explicit GraphQLInputObjectType", async () => {
    const CustomGraphQLInputObjectType = new GraphQLInputObjectType({
      name: "CustomGraphQLInputObjectType",
      fields: {
        customSampleField: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
    });
    @Resolver()
    class SampleResolver {
      @Mutation()
      sampleMutation(
        @Args("sampleArg", { typeFn: () => CustomGraphQLInputObjectType })
        _sampleArg: unknown,
      ): string {
        return "sampleMutation";
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation(sampleArg: CustomGraphQLInputObjectType!): String!
      }"
    `);
  });
});
