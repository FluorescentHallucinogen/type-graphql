import ClassType from "@src/interfaces/ClassType";

type TypedClassDecorator = <TTarget extends ClassType>(
  target: TTarget,
) => TTarget | void;

export default TypedClassDecorator;
