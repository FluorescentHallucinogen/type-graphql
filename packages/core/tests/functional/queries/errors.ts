import "reflect-metadata";
import {
  MissingExplicitTypeError,
  CannotDetermineOutputTypeError,
  ConflictingExplicitTypeOptions,
  Query,
  Resolver,
} from "@typegraphql/core";
import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("queries > return types errors", () => {
  it("should throw an error if an undecorated class is used as an explicit return type of query", async () => {
    expect.assertions(2);
    class UnknownClass {
      unknownField!: string;
    }
    @Resolver()
    class SampleResolver {
      @Query(_returns => UnknownClass)
      sampleQuery(): unknown {
        return null;
      }
    }

    try {
      await buildTestSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(CannotDetermineOutputTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot determine GraphQL output type 'UnknownClass' of SampleResolver#sampleQuery!"`,
      );
    }
  });

  it("should throw an error if `unknown` type is used as a reflected return type of query", async () => {
    expect.assertions(2);
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): unknown {
        return null;
      }
    }

    try {
      await buildTestSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Object'. You need to provide an explicit type for SampleResolver#sampleQuery in decorator option, e.g. \`@Query(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error when using `typeFn` both as parameter and as option of query", async () => {
    expect.assertions(2);

    try {
      @Resolver()
      class SampleResolver {
        @Query(_returns => String, { typeFn: () => String })
        sampleQuery(): unknown {
          return "sampleQuery";
        }
      }

      await buildTestSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictingExplicitTypeOptions);
      expect(err.message).toMatchInlineSnapshot(
        `"Conflicting explicit type options for SampleResolver#sampleQuery. You can provide the explicit type only as a parameter or as an options object property at the same time."`,
      );
    }
  });
});
