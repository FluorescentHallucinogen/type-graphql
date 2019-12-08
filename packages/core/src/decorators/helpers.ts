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

export function parseStringOrSymbol(stringOrSymbol: string | symbol): string {
  if (typeof stringOrSymbol === "symbol") {
    // TODO: use `Symbol.prototype.description`
    /* eslint-disable-next-line */
    const symbolDescription = stringOrSymbol.toString().slice(7, -1);
    if (!symbolDescription) {
      throw new MissingSymbolKeyDescriptionError();
    }
    return symbolDescription;
  }
  return stringOrSymbol;
}
