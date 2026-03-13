export function expectDefined<T>(value: T | null | undefined, message = "Expected value to be defined"): T {
  if (value === null || value === undefined) throw new Error(message);
  return value;
}
