import ClassType from "@src/interfaces/ClassType";

type TypedMethodDecorator = <TTarget extends ClassType, TMethodReturnValue>(
  prototype: InstanceType<TTarget>,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<TMethodReturnValue>, // TODO: make constraints
) => void;

export default TypedMethodDecorator;
