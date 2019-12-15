import TypeValue from "@src/interfaces/TypeValue";

export interface TypeModifiers {
  nullable: boolean;
  isArray: boolean;
}

export interface TypeMetadata {
  value: TypeValue;
  modifiers: TypeModifiers;
}
