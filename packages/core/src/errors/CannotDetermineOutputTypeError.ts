import {
  PropertyMetadata,
  TargetMetadata,
} from "@src/metadata/storage/definitions/common";
import { BuildedTypeMetadata } from "@src/metadata/builder/definitions/common";

export default class CannotDetermineOutputTypeError extends Error {
  constructor(
    metadata: TargetMetadata & PropertyMetadata & BuildedTypeMetadata,
  ) {
    const typeValue = metadata.type.value;
    // TODO: add support for other kind of types
    const typeName =
      typeValue instanceof Function ? typeValue.name : "<unknown>";
    super(
      // TODO: add message about using input type or something as a type value
      `Cannot determine GraphQL output type '${typeName}' of ${
        metadata.target.name
      }#${metadata.propertyKey.toString()}!`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
