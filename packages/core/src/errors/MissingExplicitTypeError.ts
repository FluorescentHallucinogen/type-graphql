import {
  TargetMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";

export default class MissingExplicitTypeError extends Error {
  constructor(
    { target, propertyKey }: TargetMetadata & PropertyMetadata,
    typeValue: Function | undefined,
  ) {
    let errorMessage = "";
    if (typeValue) {
      errorMessage += `Cannot transform reflected type '${typeValue.name}'. `;
    }
    errorMessage += `You need to provide an explicit type for ${
      target.name
    }#${propertyKey.toString()} in decorator option, e.g. \`@Field(type => MyType)\`.`;
    super(errorMessage);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
