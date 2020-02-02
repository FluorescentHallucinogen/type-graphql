export default function flatten<TItem>(
  nestedArray: Array<readonly TItem[]>,
): readonly TItem[] {
  return nestedArray.reduce(
    (flattenedArray, array) => flattenedArray.concat(...array),
    [],
  );
}
