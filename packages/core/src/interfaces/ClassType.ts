type ClassType<TInstanceType extends object = object> = new (
  ...args: unknown[]
) => TInstanceType;

export default ClassType;
