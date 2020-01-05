import ClassType from "@src/interfaces/ClassType";
import ResolverData from "@src/interfaces/ResolverData";

/**
 * The shape of a IoC container that is required by this library
 * to retrieve the instance of resolver class
 */
export interface ContainerType {
  get<TInstance extends object = {}>(
    resolverClass: ClassType<TInstance>,
    resolverData: ResolverData,
  ): TInstance;
}

/**
 * Function that returns an scoped instance of the IoC container,
 * based on resolver data (context)
 */
export type ContainerGetter<TContext extends object = {}> = (
  resolverData: ResolverData<TContext>,
) => ContainerType;
