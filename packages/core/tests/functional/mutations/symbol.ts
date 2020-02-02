import "reflect-metadata";

import {
  MissingSymbolKeyDescriptionError,
  Resolver,
  Mutation,
} from "@typegraphql/core";
import getPrintedMutationType from "@tests/helpers/getPrintedMutationType";

describe("mutations > symbol", () => {
  it("should correctly generate schema mutation name when symbol is used as method key", async () => {
    const sampleMutationSymbol = Symbol("sampleMutation");
    @Resolver()
    class SampleResolver {
      @Mutation()
      [sampleMutationSymbol](): string {
        return "sampleMutationSymbol";
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation: String!
      }"
    `);
  });

  it("should correctly generate schema mutation name when symbol without description is used as method key but schemaName provided", async () => {
    const sampleMutationSymbol = Symbol();
    @Resolver()
    class SampleResolver {
      @Mutation({ schemaName: "sampleMutation" })
      [sampleMutationSymbol](): string {
        return "sampleMutationSymbol";
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation: String!
      }"
    `);
  });

  it("should throw error when symbol without description is used as method key", async () => {
    expect.assertions(2);
    try {
      const sampleMutationSymbol = Symbol();
      @Resolver()
      class SampleResolver {
        @Mutation()
        [sampleMutationSymbol](): string {
          return "sampleMutationSymbol";
        }
      }
      await getPrintedMutationType(SampleResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(MissingSymbolKeyDescriptionError);
      expect(error.message).toMatchInlineSnapshot(
        `"Detected usage of a symbol without description as a property/method key. Check the properties or methods of class 'SampleResolver' and provide a proper symbol description or add a \`schemaName\` decorator option e.g. \`@Field({ schemaName: \\"nameOfSymbolField\\" })\`."`,
      );
    }
  });
});
