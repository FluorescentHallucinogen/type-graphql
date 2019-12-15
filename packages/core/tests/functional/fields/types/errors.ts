import "reflect-metadata";
import {
  ObjectType,
  Field,
  buildSchema,
  MissingExplicitTypeError,
  CannotDetermineOutputTypeError,
} from "@typegraphql/core";

describe("Fields types > errors", () => {
  it("should throw an error if an undecorated class is used as an explicit type", async () => {
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
      await buildSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(CannotDetermineOutputTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot determine GraphQL output type 'UnknownClass' of SampleObject#sampleField!"`,
      );
    }
  });

  it("should throw an error if Array is used as a reflected type", async () => {
    expect.assertions(2);
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string[];
    }

    try {
      await buildSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Array'. You need to provide an explicit type for SampleObject#sampleField in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error if Promise is used as a reflected type", async () => {
    expect.assertions(2);
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: Promise<string>;
    }

    try {
      await buildSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Promise'. You need to provide an explicit type for SampleObject#sampleField in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error if interface is used as a reflected type", async () => {
    expect.assertions(2);
    interface UnknownType {
      unknownField: string;
    }
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: UnknownType;
    }

    try {
      await buildSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Object'. You need to provide an explicit type for SampleObject#sampleField in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error if TS union type is used as a reflected type", async () => {
    expect.assertions(2);
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string | null;
    }

    try {
      await buildSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Object'. You need to provide an explicit type for SampleObject#sampleField in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error if `any` type is used as a reflected type", async () => {
    expect.assertions(2);
    @ObjectType()
    class SampleObject {
      @Field()
      // eslint-disable-next-line
      sampleField!: any;
    }

    try {
      await buildSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Object'. You need to provide an explicit type for SampleObject#sampleField in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });
});
