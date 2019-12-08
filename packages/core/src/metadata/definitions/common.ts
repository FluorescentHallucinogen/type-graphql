import ClassType from "@src/interfaces/ClassType";

export interface TargetMetadata {
  target: ClassType;
}

export interface PropertyMetadata {
  propertyKey: string | symbol;
}

export interface NameMetadata {
  name: string;
}

export interface DescriptionMetadata {
  description: string | undefined;
}
