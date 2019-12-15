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

export default function Field(options?: FieldOptions): TypedPropertyDecorator;
export default function Field(
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
