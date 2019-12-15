import "reflect-metadata";
import { printType } from "graphql";

import { buildSchema, ObjectType, Field } from "@typegraphql/core";

describe("Fields types > nullable", () => {
  it("should correctly generate nullable field in schema using `nullable: true` decorator option", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => String, { nullable: true })
      sampleField!: string;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String
      }"
    `);
  });

  it("should correctly generate nullable field in schema using `nullableByDefault: true` build schema option", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => String)
      sampleField!: string;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
      nullableByDefault: true,
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String
      }"
    `);
  });

  it("should correctly generate not nullable field in schema when `nullableByDefault: true` and `nullable: false`", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => String, { nullable: false })
      sampleField!: string;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
      nullableByDefault: true,
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String!
      }"
    `);
  });

  it("should generate proper field signature in schema for nullable string array type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => [String], { nullable: true })
      sampleField!: unknown;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: [String]
      }"
    `);
  });

  it("should generate proper field signature in schema for nullable nested string array type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => [[[String]]], { nullable: true })
      sampleField!: unknown;
    }

    const schema = await buildSchema({
      orphanedTypes: [SampleObject],
    });
    const sampleObjectType = schema.getType("SampleObject")!;

    expect(printType(sampleObjectType)).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: [[[String]]]
      }"
    `);
  });
});
