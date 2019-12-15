import ClassType from "@src/interfaces/ClassType";

export interface TargetMetadata {
  target: ClassType;
}

export interface PropertyMetadata {
  propertyKey: string | symbol;
}

export interface SchemaNameMetadata {
  schemaName: string;
}

export interface DescriptionMetadata {
  description: string | undefined;
}

export interface NullableMetadata {
  nullable: boolean | undefined;
}
