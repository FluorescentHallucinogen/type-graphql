import ClassType from "@src/interfaces/ClassType";
import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";

export interface TargetClassMetadata {
  readonly targetClass: ClassType;
}

export interface PropertyMetadata {
  readonly propertyKey: string | symbol;
}

export interface SchemaNameMetadata {
  readonly schemaName: string;
}

export interface DescriptionMetadata {
  readonly description: string | undefined;
}

export interface NullableMetadata {
  readonly nullable: boolean | undefined;
}

export interface ExplicitTypeMetadata {
  readonly explicitTypeFn: ExplicitTypeFn | undefined;
}
