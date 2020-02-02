import "reflect-metadata";
import {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { Resolver, Mutation } from "@typegraphql/core";
import getPrintedMutationType from "@tests/helpers/getPrintedMutationType";

describe("mutations > return types GraphQL-JS interoperability", () => {
  it("should generate proper schema signature for mutation with explicit GraphQLScalarType", async () => {
    const CustomScalar = new GraphQLScalarType({
      name: "CustomScalar",
      serialize: it => it,
    });
    @Resolver()
    class SampleResolver {
      @Mutation(_returns => CustomScalar)
      sampleMutation(): unknown {
        return null;
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation: CustomScalar!
      }"
    `);
  });

  it("should generate proper schema signature for mutation with explicit GraphQLObjectType", async () => {
    const CustomGraphQLObjectType = new GraphQLObjectType({
      name: "CustomGraphQLObjectType",
      fields: {
        customSampleField: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
    });
    @Resolver()
    class SampleResolver {
      @Mutation(_returns => CustomGraphQLObjectType)
      sampleMutation(): unknown {
        return null;
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation: CustomGraphQLObjectType!
      }"
    `);
  });
});
