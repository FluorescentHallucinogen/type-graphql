import TypeValue from "@src/interfaces/TypeValue";

export interface TypeModifiers {
  nullable: boolean;
  /** Value 0 means no list */
  listDepth: number;
}

export interface TypeMetadata {
  value: TypeValue;
  modifiers: TypeModifiers;
}
