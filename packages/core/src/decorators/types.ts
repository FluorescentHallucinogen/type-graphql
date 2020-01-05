import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";

export interface Nameable {
  /**
   * A string that will be emitted in GraphQL schema,
   * which will overwrite the implicit one taken from a property/method name
   */
  schemaName?: string;
}

export interface Descriptionable {
  /**
   * Field/type description string that will be emitted in GraphQL schema, e.g.:
   *
   * ```graphql
   * """Example field description"""
   * sampleField: String!
   * ```
   */
  description?: string;
}

export interface Nullable {
  /**
   * Setting to `true` will emit a nullable field type in GraphQL schema, e.g.:
   *
   * ```graphql
   * nullableStringField: String
   * ```
   */
  nullable?: boolean;
}

export interface ExplicitTypeable {
  /**
   * Function that returns an explicit type to overwrite
   * or enhance the built-in TypeScript type reflection system,
   * e.g. `@Field({ typeFn: () => [String] })`
   */
  typeFn?: ExplicitTypeFn;
}
