import DefaultContainer from "@src/runtime/container/DefaultContainer";
import { ContainerType, ContainerGetter } from "@src/interfaces/container";
import ClassType from "@src/interfaces/ClassType";
import ResolverData from "@src/interfaces/ResolverData";

/**
 * Container to be used by this library for inversion control.
 * If custom container or a getter was not explicitly set
 * then the default, simple container is used instead.
 */
export default class IoCContainer<TContext extends object = {}> {
  private readonly container: ContainerType | undefined;
  private readonly containerGetter: ContainerGetter<TContext> | undefined;

  constructor(
    iocContainerOrContainerGetter?: ContainerType | ContainerGetter<TContext>,
  ) {
    if (!iocContainerOrContainerGetter) {
      this.container = new DefaultContainer();
    } else if (
      "get" in iocContainerOrContainerGetter &&
      typeof iocContainerOrContainerGetter.get === "function"
    ) {
      this.container = iocContainerOrContainerGetter;
    } else if (typeof iocContainerOrContainerGetter === "function") {
      this.containerGetter = iocContainerOrContainerGetter;
    } else {
      throw new Error("TODO: message");
    }
  }

  getInstance<TInstance extends object = {}>(
    someClass: ClassType<TInstance>,
    resolverData: ResolverData<TContext>,
  ): PromiseLike<TInstance> | TInstance {
    // we always assign container or containerGetter in constructor
    const container = (this.container ?? this.containerGetter?.(resolverData))!;
    return container.get(someClass, resolverData);
  }
}
