import "reflect-metadata";
import {
  Query,
  Resolver,
  MissingClassMetadataError,
  MissingResolverMethodsError,
} from "@typegraphql/core";
import buildTestSchema from "@tests/helpers/buildTestSchema";

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
      await buildTestSchema({
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
      await buildTestSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingResolverMethodsError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find any methods metadata for resolver class 'SampleResolver' in storage. Are the methods annotated with a '@Query()' or similar decorators?"`,
      );
    }
  });
});
