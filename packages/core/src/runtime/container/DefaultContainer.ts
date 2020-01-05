import { ContainerType } from "@src/interfaces/container";
import ClassType from "@src/interfaces/ClassType";

/**
 * Default, simple IoC container that is used by this library
 * for inversion control. It simply creates a new instance
 * of the given class and cache it for a future usage.
 */
export default class DefaultContainer implements ContainerType {
  private readonly instancesMap = new WeakMap<ClassType<object>, object>();

  get<TInstance extends object>(
    resolverClass: ClassType<TInstance>,
  ): TInstance {
    if (!this.instancesMap.has(resolverClass)) {
      const instance = new resolverClass();
      this.instancesMap.set(resolverClass, instance);
    }

    // TODO: make WeakMap more generic?
    return this.instancesMap.get(resolverClass) as TInstance;
  }
}
