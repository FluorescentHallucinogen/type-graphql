export default class MissingSymbolKeyDescriptionError extends Error {
  constructor() {
    super("Symbol keys need to have a proper description!");

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
