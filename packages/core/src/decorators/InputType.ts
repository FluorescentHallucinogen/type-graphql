import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import TypedClassDecorator from "@src/interfaces/TypedClassDecorator";
import { Nameable, Descriptionable } from "@src/decorators/types";

export interface InputTypeOptions extends Nameable, Descriptionable {}

/**
 * Decorator used to register the class as an Input Object Type in GraphQL schema, e.g.:
 *
 * ```graphql
 * input MyClass {
 *  myProperty: SomeType!
 *  myOtherProperty: SomeOtherType!
 * }
 * ```
 *
 * Can be also used as the args of query/mutation/field resolver arguments, e.g.:
 *
 * ```graphql
 * type Mutation {
 *  sampleMutation(
 *    myProperty: SomeType!
 *    myOtherProperty: SomeOtherType!
 *  ): OtherType!
 * }
 * ```
 */
export default function InputType(
  options: InputTypeOptions = {},
): TypedClassDecorator {
  return target => {
    RawMetadataStorage.get().collectInputTypeMetadata({
      target,
      schemaName: options.schemaName ?? target.name,
      description: options.description,
    });
  };
}
