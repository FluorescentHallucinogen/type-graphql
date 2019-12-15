import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";
import { MissingSymbolKeyDescriptionError } from "@src/errors";

export interface TypeDecoratorParams<TOptions extends object> {
  options?: TOptions;
  explicitTypeFn?: ExplicitTypeFn;
}

export function parseDecoratorParameters<TOptions extends object>(
  explicitTypeFnOrOptions: ExplicitTypeFn | TOptions | undefined,
  maybeOptions: TOptions | undefined,
): TypeDecoratorParams<TOptions> {
  if (typeof explicitTypeFnOrOptions === "function") {
    return {
      explicitTypeFn: explicitTypeFnOrOptions as ExplicitTypeFn,
      options: maybeOptions,
    };
  } else {
    return {
      options: explicitTypeFnOrOptions,
    };
  }
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
