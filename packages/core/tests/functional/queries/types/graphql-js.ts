import "reflect-metadata";
import {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { Resolver, Query } from "@typegraphql/core";
import getPrintedQuery from "@tests/helpers/getPrintedQuery";

describe("Queries return types > GraphQL-JS interoperability", () => {
  it("should generate proper schema signature for query with explicit GraphQLScalarType", async () => {
    const CustomScalar = new GraphQLScalarType({
      name: "CustomScalar",
      serialize: it => it,
    });
    @Resolver()
    class SampleResolver {
      @Query(_returns => CustomScalar)
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: CustomScalar!
      }"
    `);
  });

  it("should generate proper schema signature for query with explicit GraphQLObjectType", async () => {
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
      @Query(_returns => CustomGraphQLObjectType)
      sampleQuery(): unknown {
        return null;
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: CustomGraphQLObjectType!
      }"
    `);
  });
});
