import "reflect-metadata";

import {
  MissingSymbolKeyDescriptionError,
  Resolver,
  Query,
} from "@typegraphql/core";
import getPrintedQueryType from "@tests/helpers/getPrintedQueryType";

describe("queries > symbol", () => {
  it("should correctly generate schema query name when symbol is used as method key", async () => {
    const sampleQuerySymbol = Symbol("sampleQuery");
    @Resolver()
    class SampleResolver {
      @Query()
      [sampleQuerySymbol](): string {
        return "sampleQuerySymbol";
      }
    }

    const printedQueryType = await getPrintedQueryType(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String!
      }"
    `);
  });

  it("should correctly generate schema query name when symbol without description is used as method key but schemaName provided", async () => {
    const sampleQuerySymbol = Symbol();
    @Resolver()
    class SampleResolver {
      @Query({ schemaName: "sampleQuery" })
      [sampleQuerySymbol](): string {
        return "sampleQuerySymbol";
      }
    }

    const printedQueryType = await getPrintedQueryType(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String!
      }"
    `);
  });

  it("should throw error when symbol without description is used as method key", async () => {
    expect.assertions(2);
    try {
      const sampleQuerySymbol = Symbol();
      @Resolver()
      class SampleResolver {
        @Query()
        [sampleQuerySymbol](): string {
          return "sampleQuerySymbol";
        }
      }
      await getPrintedQueryType(SampleResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(MissingSymbolKeyDescriptionError);
      expect(error.message).toMatchInlineSnapshot(
        `"Detected usage of a symbol without description as a property/method key. Check the properties or methods of class 'SampleResolver' and provide a proper symbol description or add a \`schemaName\` decorator option e.g. \`@Field({ schemaName: \\"nameOfSymbolField\\" })\`."`,
      );
    }
  });
});
