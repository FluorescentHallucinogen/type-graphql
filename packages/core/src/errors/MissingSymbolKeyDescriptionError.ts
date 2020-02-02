import { TargetClassMetadata } from "@src/metadata/storage/definitions/common";

export default class MissingSymbolKeyDescriptionError extends Error {
  constructor({ targetClass }: TargetClassMetadata) {
    super(
      "Detected usage of a symbol without description as a property/method key. " +
        `Check the properties or methods of class '${targetClass.name}' ` +
        "and provide a proper symbol description " +
        "or add a `schemaName` decorator option " +
        'e.g. `@Field({ schemaName: "nameOfSymbolField" })`.',
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
