export default class MissingQueryMethodError extends Error {
  constructor() {
    super(
      `Detected no method with a '@Query' decorator in provided resolvers. ` +
        `GraphQL specification requires that type Query must define one or more fields.`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
