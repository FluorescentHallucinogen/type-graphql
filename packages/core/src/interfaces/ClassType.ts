/**
 * Special type describing JS class (constructor)
 * that allows to use Function and get known its type as TInstance
 */
type ClassType<TInstance extends object = {}> = new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => TInstance;

export default ClassType;
