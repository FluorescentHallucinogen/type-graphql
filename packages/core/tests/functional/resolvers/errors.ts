import "reflect-metadata";
import {
  Query,
  Resolver,
  MissingClassMetadataError,
  MissingResolverMethodsError,
  Mutation,
  buildSchema,
  MissingQueryMethodError,
} from "@typegraphql/core";

describe("Resolvers > errors", () => {
  it("should throw an error if an undecorated resolver class is provided to `buildSchema`", async () => {
    expect.assertions(2);
    class SampleResolver {
      @Query()
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    try {
      await buildSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingClassMetadataError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find metadata for class 'SampleResolver' in storage. Is it annotated with the '@Resolver' decorator?"`,
      );
    }
  });

  it("should throw an error if a resolver class without annotated queries/mutations/subscriptions is provided to `buildSchema`", async () => {
    expect.assertions(2);
    @Resolver()
    class SampleResolver {
      sampleMethod(): string {
        return "sampleMethod";
      }
    }

    try {
      await buildSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingResolverMethodsError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find any methods metadata for resolver class 'SampleResolver' in storage. Are the methods annotated with a '@Query()', '@Mutation()' or similar decorators?"`,
      );
    }
  });

  it("should throw an error if none of the resolvers contains a `@Query` method", async () => {
    expect.assertions(2);
    @Resolver()
    class SampleResolver {
      @Mutation()
      sampleMutation(): string {
        return "sampleMutation";
      }
    }

    try {
      await buildSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingQueryMethodError);
      expect(err.message).toMatchInlineSnapshot(
        `"Detected no method with a '@Query' decorator in provided resolvers. GraphQL specification requires that type Query must define one or more fields."`,
      );
    }
  });
});
