import ClassType from "@src/interfaces/ClassType";

export type MissingMetadataType = "ObjectType" | "Resolver";

export default class MissingClassMetadataError extends Error {
  constructor(typeClass: ClassType, type: MissingMetadataType) {
    super(
      `Cannot find metadata for class '${typeClass.name}' in storage. ` +
        `Is it annotated with the '@${type}' decorator?`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
