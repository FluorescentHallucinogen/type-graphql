import ClassType from "@src/interfaces/ClassType";
import NonEmptyArray from "@src/interfaces/NonEmptyArray";
import { ContainerType, ContainerGetter } from "@src/interfaces/container";

export default interface BuildSchemaOptions<TContext extends object = {}> {
  /**
   * Array of classes annotated with `@Resolver` decorator
   * that will be taken into account during GraphQL schema generation
   */
  resolvers: NonEmptyArray<ClassType>;
  /**
   * Array of orphaned type classes
   * that are not used explicitly in GraphQL types definitions
   */
  orphanedTypes?: NonEmptyArray<ClassType>;
  /**
   * Instance of IoC container that will be used by this library
   * to get the instances of resolver classes or a function
   * that will return the container instance based on resolver data
   */
  container?: ContainerType | ContainerGetter<TContext>;
  /**
   * Default `nullable` value for type decorators,
   * like `@Field({ nullable: true })`
   */
  nullableByDefault?: boolean;
}
