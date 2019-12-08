import ClassType from "@src/interfaces/ClassType";

type TypedPropertyDecorator = <TTarget extends ClassType>(
  prototype: InstanceType<TTarget>,
  propertyKey: string | symbol,
) => void;

export default TypedPropertyDecorator;
