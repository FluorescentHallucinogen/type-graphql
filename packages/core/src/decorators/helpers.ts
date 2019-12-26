import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";
import {
  MissingSymbolKeyDescriptionError,
  ConflictingExplicitTypeOptions,
} from "@src/errors";
import { ExplicitTypeable } from "@src/decorators/types";
import {
  TargetMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";

export interface TypeDecoratorParams<TOptions extends ExplicitTypeable> {
  options?: Omit<TOptions, keyof ExplicitTypeable>;
  explicitTypeFn?: ExplicitTypeFn;
}

export function parseDecoratorParameters<TOptions extends ExplicitTypeable>(
  maybeExplicitTypeFnOrOptions: ExplicitTypeFn | TOptions | undefined,
  maybeOptions: TOptions | undefined,
  metadata: TargetMetadata & PropertyMetadata,
): TypeDecoratorParams<TOptions> {
  if (!maybeExplicitTypeFnOrOptions) {
    return {};
  }
  if (typeof maybeExplicitTypeFnOrOptions === "object") {
    const { typeFn: explicitTypeFn, ...options } = maybeExplicitTypeFnOrOptions;
    return { explicitTypeFn, options };
  }
  if (maybeOptions?.typeFn) {
    throw new ConflictingExplicitTypeOptions(metadata);
  }
  return {
    explicitTypeFn: maybeExplicitTypeFnOrOptions,
    options: maybeOptions,
  };
}

const SYMBOL_DESCRIPTION_START_INDEX = 7;

export function parseStringOrSymbol(stringOrSymbol: string | symbol): string {
  if (typeof stringOrSymbol === "string") {
    return stringOrSymbol;
  }

  // TODO: use `Symbol.prototype.description`
  const symbolDescription = stringOrSymbol
    .toString()
    .slice(SYMBOL_DESCRIPTION_START_INDEX, -1);
  if (symbolDescription) {
    return symbolDescription;
  }

  throw new MissingSymbolKeyDescriptionError();
}
