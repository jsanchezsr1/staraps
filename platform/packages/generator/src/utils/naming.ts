export function toKebabCase(input: string): string {
  return input.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").toLowerCase();
}

export function toPascalCase(input: string): string {
  return input.replace(/(^\w|[-_\s]\w)/g, (m) => m.replace(/[-_\s]/g, "").toUpperCase());
}

export function toCamelCase(input: string): string {
  const pascal = toPascalCase(input);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
