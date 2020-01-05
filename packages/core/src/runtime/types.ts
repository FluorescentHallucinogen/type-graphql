export interface DynamicResolverInstance {
  [propertyKey: string]: (...args: unknown[]) => unknown;
}
