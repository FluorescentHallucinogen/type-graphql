import TypeValue from "@src/interfaces/TypeValue";

export default interface TypeMetadata {
  value: TypeValue;
  modifiers: {
    nullable: boolean;
    isArray: boolean;
  };
}
