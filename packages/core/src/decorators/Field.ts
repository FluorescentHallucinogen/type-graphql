import TypedPropertyDecorator from "@src/interfaces/TypedPropertyDecorator";
import MetadataStorage from "@src/metadata/storage/MetadataStorage";
import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";
import {
  parseDecoratorParameters,
  parseStringOrSymbol,
} from "@src/decorators/helpers";
import { Nameable, Descriptionable, Nullable } from "@src/decorators/types";
import ClassType from "@src/interfaces/ClassType";

export interface FieldOptions extends Nameable, Descriptionable, Nullable {}

/**
 * Decorator used to register the class property
 * as an field of ObjectType or InputType in GraphQL schema, e.g.:
 *
 * ```graphql
 * type MyClass {
 *  myProperty: SomeType!
 * }
 * ```
 */
export default function Field(options?: FieldOptions): TypedPropertyDecorator;
export default function Field(
  /**
   * Function that returns an explicit type to overwrite
   * or enhance the built-in TypeScript type reflection system,
   * e.g. `@Field(type => [String])`
   */
  explicitTypeFn: ExplicitTypeFn,
  options?: FieldOptions,
): TypedPropertyDecorator;
export default function Field(
  explicitTypeFnOrOptions?: ExplicitTypeFn | FieldOptions,
  maybeOptions?: FieldOptions,
): TypedPropertyDecorator {
  const { explicitTypeFn, options = {} } = parseDecoratorParameters(
    explicitTypeFnOrOptions,
    maybeOptions,
  );
  return (prototype, propertyKey) => {
    MetadataStorage.get().collectFieldMetadata({
      target: prototype.constructor as ClassType, // FIXME: fix typed decorator signature
      propertyKey,
      schemaName: options.schemaName ?? parseStringOrSymbol(propertyKey),
      description: options.description,
      nullable: options.nullable,
      explicitTypeFn,
    });
  };
}
