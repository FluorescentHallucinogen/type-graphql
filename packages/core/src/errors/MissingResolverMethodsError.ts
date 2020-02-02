import ClassType from "@src/interfaces/ClassType";

export default class MissingResolverMethodsError extends Error {
  constructor(typeClass: ClassType) {
    super(
      `Cannot find any methods metadata for resolver class '${typeClass.name}' in storage. ` +
        `Are the methods annotated with a '@Query()', '@Mutation()' or similar decorators?`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
