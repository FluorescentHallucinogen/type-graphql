import RecursiveSingleTuple from "@src/interfaces/RecursiveSingleTuple";
import TypeValue from "@src/interfaces/TypeValue";

export type ExplicitTypeFnValue = TypeValue | RecursiveSingleTuple<TypeValue>;

type ExplicitTypeFn = (keyword?: void) => ExplicitTypeFnValue;
export default ExplicitTypeFn;
