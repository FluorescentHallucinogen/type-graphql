import TypeValue from "@src/interfaces/TypeValue";

export interface TypeModifiers {
  readonly nullable: boolean;
  /** Value 0 means no list */
  readonly listDepth: number;
}

export interface TypeInfo {
  readonly value: TypeValue;
  readonly modifiers: TypeModifiers;
}
