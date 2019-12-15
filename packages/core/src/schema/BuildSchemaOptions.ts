import ClassType from "@src/interfaces/ClassType";
import NonEmptyArray from "@src/interfaces/NonEmptyArray";

export default interface BuildSchemaOptions {
  /**
   * Array of orphaned type classes that are not used explicitly in GraphQL types definitions
   */
  orphanedTypes: NonEmptyArray<ClassType>;
  /**
   * Default `nullable` value for type decorators, like `@Field({ nullable: true })`
   */
  nullableByDefault?: boolean;
}
