import "reflect-metadata";

import { Resolver, Mutation } from "@typegraphql/core";
import getPrintedMutationType from "@tests/helpers/getPrintedMutationType";

describe("mutations > options", () => {
  it("should correctly generate mutation field name using `schemaName` decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation({ schemaName: "sampleMutationSchemaName" })
      sampleMutation(): string {
        return "sampleMutation";
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutationSchemaName: String!
      }"
    `);
  });

  it("should correctly generate mutation field description using `description` decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation({ description: "sampleMutation description" })
      sampleMutation(): string {
        return "sampleMutation";
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        \\"\\"\\"sampleMutation description\\"\\"\\"
        sampleMutation: String!
      }"
    `);
  });

  it("should correctly generate mutation field nullable type using `nullable` decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation(_returns => String, { nullable: true })
      sampleMutation(): string {
        return "sampleMutation";
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation: String
      }"
    `);
  });

  it("should correctly generate mutation field type using `typeFn` decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation({ typeFn: () => [String] })
      sampleMutation(): string {
        return "sampleMutation";
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation: [String!]!
      }"
    `);
  });

  it("should correctly generate mutation field type using explicit type decorator option", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation(_returns => [String])
      sampleMutation(): string {
        return "sampleMutation";
      }
    }

    const printedMutationType = await getPrintedMutationType(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation: [String!]!
      }"
    `);
  });
});
