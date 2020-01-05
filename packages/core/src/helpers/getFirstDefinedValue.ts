export default function getFirstDefinedValue<TValue>(
  iterable: Iterable<TValue | undefined>,
): TValue | undefined {
  return Array.from(iterable).find(Boolean);
}
