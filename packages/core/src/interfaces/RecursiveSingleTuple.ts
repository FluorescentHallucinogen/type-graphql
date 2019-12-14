type RecursiveSingleTuple<TValue> = [RecursiveSingleTuple<TValue> | TValue];

export default RecursiveSingleTuple;
