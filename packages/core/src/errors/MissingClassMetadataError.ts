import ClassType from "@src/interfaces/ClassType";

export default class MissingClassMetadataError extends Error {
  constructor(typeClass: ClassType, type: "ObjectType") {
    super(
      `Cannot find metadata for '${typeClass.name}' in storage. Is it decorated with an @${type} decorator?`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
