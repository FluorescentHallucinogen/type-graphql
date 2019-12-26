import {
  PropertyMetadata,
  TargetMetadata,
} from "@src/metadata/storage/definitions/common";
import { BuildedTypeMetadata } from "@src/metadata/builder/definitions/common";

export default class CannotDetermineOutputTypeError extends Error {
  constructor({
    target,
    propertyKey,
    type,
  }: TargetMetadata & PropertyMetadata & BuildedTypeMetadata) {
    // TODO: add support for other kind of types
    const typeName =
      type.value instanceof Function ? type.value.name : "<unknown>";
    super(
      // TODO: add message about using input type or something as a type value
      `Cannot determine GraphQL output type '${typeName}' ` +
        `of ${target.name}#${propertyKey.toString()}!`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
