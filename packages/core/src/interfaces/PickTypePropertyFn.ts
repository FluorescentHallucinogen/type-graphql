import ClassType from "@src/interfaces/ClassType";

export type PropertyAccessProxy<TObject extends object> = {
  [TProperty in keyof TObject]: string | symbol;
};

type PickTypePropertyFn<TClassType extends ClassType = ClassType> = (
  classType: PropertyAccessProxy<InstanceType<TClassType>>,
) => string | symbol;

export default PickTypePropertyFn;
