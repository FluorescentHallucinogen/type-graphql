import ClassType from "@src/interfaces/ClassType";

export default class MissingFieldsError extends Error {
  constructor(typeClass: ClassType) {
    super(
      `Cannot find any fields metadata for type class '${typeClass.name}' in storage. ` +
        `Are the properties annotated with a '@Field()' decorator?`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
