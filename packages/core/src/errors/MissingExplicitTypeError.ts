import {
  TargetClassMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import RawParameterMetadata from "@src/metadata/storage/definitions/parameters/ParameterMetadata";

export type MissingExplicitTypeDecoratorKind =
  | "Field"
  | "Args"
  | "Query"
  | "Mutation";

export default class MissingExplicitTypeError extends Error {
  constructor(
    {
      targetClass,
      propertyKey,
      parameterIndex,
    }: TargetClassMetadata & PropertyMetadata & Partial<RawParameterMetadata>,
    typeValue: Function | undefined,
    kind: MissingExplicitTypeDecoratorKind,
  ) {
    let errorMessage = "";
    if (typeValue) {
      errorMessage += `Cannot transform reflected type '${typeValue.name}'. `;
    }
    errorMessage += `You need to provide an explicit type for `;
    if (parameterIndex != null) {
      errorMessage += `parameter #${parameterIndex.toFixed(0)} of `;
    }
    errorMessage += `${
      targetClass.name
    }#${propertyKey.toString()} in decorator option, e.g. `;
    if (kind === "Args") {
      errorMessage += `\`@Args("myArg", { typeFn: () => [String] })\`.`;
    } else {
      errorMessage += `\`@${kind}(type => MyType)\`.`;
    }
    super(errorMessage);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
