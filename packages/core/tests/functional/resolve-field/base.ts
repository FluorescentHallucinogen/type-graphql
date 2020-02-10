import "reflect-metadata";
import {
  ObjectType,
  Field,
  Resolver,
  buildSchema,
  Query,
  ResolveField,
} from "@typegraphql/core";
import { execute } from "graphql";
import gql from "graphql-tag";

describe("resolve field > base", () => {
  it("should call resolver class method to resolve field value", async () => {
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

    const schema = await buildSchema({
      resolvers: [TestResolver],
    });

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
});
