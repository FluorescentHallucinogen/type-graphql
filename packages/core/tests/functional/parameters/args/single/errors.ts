import "reflect-metadata";
import {
  Query,
  Args,
  Resolver,
  MissingExplicitTypeError,
} from "@typegraphql/core";

import getPrintedQueryType from "@tests/helpers/getPrintedQueryType";

describe("parameters > args > single > errors", () => {
  it("should throw error when unknown type is provided as TS type", async () => {
    expect.assertions(2);
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(@Args("testArg") _testArg: unknown): string {
        return "testQuery";
      }
    }
    try {
      await getPrintedQueryType(TestResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(MissingExplicitTypeError);
      expect(error.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Object'. You need to provide an explicit type for parameter #0 of TestResolver#testQuery in decorator option, e.g. \`@Args(\\"myArg\\", { typeFn: () => [String] })\`."`,
      );
    }
  });
});
