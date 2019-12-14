import ClassType from "@src/interfaces/ClassType";

export default interface BuildSchemaOptions {
  /**
   * Array of orphaned type classes that are not used explicitly in GraphQL types definitions
   */
  orphanedTypes: ClassType[];
}
