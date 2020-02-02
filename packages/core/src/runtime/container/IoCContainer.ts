import createDebug from "debug";

import DefaultContainer from "@src/runtime/container/DefaultContainer";
import { ContainerType, ContainerGetter } from "@src/interfaces/container";
import ClassType from "@src/interfaces/ClassType";
import ResolverData from "@src/interfaces/ResolverData";

const debug = createDebug("@typegraphql/core:IoCContainer");

/**
 * Container to be used by this library for inversion control.
 * If custom container or a getter was not explicitly set
 * then the default, simple container is used instead.
 */
export default class IoCContainer<TContext extends object = {}> {
  private readonly container: ContainerType<TContext>;

  constructor(
    iocContainerOrContainerGetter?: ContainerType | ContainerGetter<TContext>,
  ) {
    debug("created IoCContainer instance", { iocContainerOrContainerGetter });
    if (!iocContainerOrContainerGetter) {
      this.container = new DefaultContainer();
    } else if (
      "get" in iocContainerOrContainerGetter &&
      typeof iocContainerOrContainerGetter.get === "function"
    ) {
      this.container = iocContainerOrContainerGetter;
    } else if (typeof iocContainerOrContainerGetter === "function") {
      this.container = {
        get: (someClass, resolverData) => {
          const container = iocContainerOrContainerGetter(resolverData);
          return container.get(someClass, resolverData);
        },
      };
    } else {
      // shouldn't never happen but TS claims it can be of type `ContainerType`
      throw new Error("Invalid option provided to IoCContainer");
    }
  }

  getInstance<TInstance extends object = {}>(
    someClass: ClassType<TInstance>,
    resolverData: ResolverData<TContext>,
  ): PromiseLike<TInstance> | TInstance {
    return this.container.get(someClass, resolverData);
  }
}
