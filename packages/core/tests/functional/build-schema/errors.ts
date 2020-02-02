import "reflect-metadata";
import {
  ObjectType,
  Field,
  MissingClassMetadataError,
  ContainerType,
} from "@typegraphql/core";

import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("buildSchema > errors", () => {
  it("should throw an error if an undecorated class is provided as `orphanedTypes` option", async () => {
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
      await buildTestSchema({
        orphanedTypes: [SampleObject, UnknownClass],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingClassMetadataError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find metadata for class 'UnknownClass' in storage. Is it annotated with a TypeGraphQL decorator?"`,
      );
    }
  });

  it("should throw an error if invalid value is provided as `container` option", async () => {
    expect.assertions(2);
    try {
      await buildTestSchema({
        container: ({} as unknown) as ContainerType,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatchInlineSnapshot(
        `"Invalid option provided to IoCContainer"`,
      );
    }
  });
});
