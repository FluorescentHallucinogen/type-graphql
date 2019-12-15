import ClassType from "@src/interfaces/ClassType";

export default class MissingFieldsError extends Error {
  constructor(typeClass: ClassType) {
    super(
      `Cannot find fields metadata for '${typeClass.name}' in storage. Are the properties decorated with a @Field() decorator?`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
