import "reflect-metadata";
import {
  ObjectType,
  Field,
  buildSchema,
  MissingClassMetadataError,
  MissingFieldsError,
} from "@typegraphql/core";

describe("Object types > errors", () => {
  it("should throw an error if an undecorated class is provided to buildSchema", async () => {
    expect.assertions(2);
    class UnknownClass {
      unknownField!: string;
    }
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string;
    }

    try {
      await buildSchema({
        orphanedTypes: [SampleObject, UnknownClass],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingClassMetadataError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find metadata for 'UnknownClass' in storage. Is it decorated with an @ObjectType decorator?"`,
      );
    }
  });

  it("should throw an error if the object type has no fields registered", async () => {
    expect.assertions(2);
    @ObjectType()
    class SampleObject {
      sampleField!: string;
    }

    try {
      await buildSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingFieldsError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find fields metadata for 'SampleObject' in storage. Are the properties decorated with a @Field() decorator?"`,
      );
    }
  });
});
