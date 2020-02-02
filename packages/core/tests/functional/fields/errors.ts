import "reflect-metadata";
import {
  ObjectType,
  Field,
  MissingExplicitTypeError,
  ConflictingExplicitTypeOptions,
  CannotDetermineOutputTypeError,
  InputType,
  CannotDetermineInputTypeError,
} from "@typegraphql/core";
import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("Fields types > errors", () => {
  it("should throw an error if an undecorated class is used as an explicit output type", async () => {
    expect.assertions(2);
    class UnknownClass {
      unknownField!: string;
    }
    @ObjectType()
    class SampleObject {
      @Field(_type => UnknownClass)
      sampleField!: unknown;
    }

    try {
      await buildTestSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(CannotDetermineOutputTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot determine GraphQL output type 'UnknownClass' of SampleObject#sampleField!"`,
      );
    }
  });

  it("should throw an error if an undecorated class is used as an explicit input type", async () => {
    expect.assertions(2);
    class UnknownClass {
      unknownField!: string;
    }
    @InputType()
    class SampleObject {
      @Field(_type => UnknownClass)
      sampleField!: unknown;
    }

    try {
      await buildTestSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(CannotDetermineInputTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot determine GraphQL input type 'UnknownClass' of SampleObject#sampleField!"`,
      );
    }
  });

  it("should throw an error if `unknown` type is used as a reflected type", async () => {
    expect.assertions(2);
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: unknown;
    }

    try {
      await buildTestSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Object'. You need to provide an explicit type for SampleObject#sampleField in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error when using `typeFn` both as parameter and as option", async () => {
    expect.assertions(2);

    try {
      @ObjectType()
      class SampleObject {
        @Field(_type => String, { typeFn: () => String })
        sampleField!: unknown;
      }
      await buildTestSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictingExplicitTypeOptions);
      expect(err.message).toMatchInlineSnapshot(
        `"Conflicting explicit type options for SampleObject#sampleField. You can provide the explicit type only as a parameter or as an options object property at the same time."`,
      );
    }
  });
});
