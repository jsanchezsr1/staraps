export type DiffChangeType = "added" | "removed" | "modified";

export type AppSpecDiffEntry = {
  path: string;
  type: DiffChangeType;
  before?: unknown;
  after?: unknown;
};

export function diffAppSpecs(before: any, after: any, basePath = ""): AppSpecDiffEntry[] {
  const entries: AppSpecDiffEntry[] = [];
  const beforeObj = before || {};
  const afterObj = after || {};
  const keys = new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]);

  for (const key of keys) {
    const path = basePath ? `${basePath}.${key}` : key;
    const left = beforeObj[key];
    const right = afterObj[key];

    if (typeof left === "undefined") {
      entries.push({ path, type: "added", after: right });
      continue;
    }

    if (typeof right === "undefined") {
      entries.push({ path, type: "removed", before: left });
      continue;
    }

    const bothObjects =
      left &&
      right &&
      typeof left === "object" &&
      typeof right === "object" &&
      !Array.isArray(left) &&
      !Array.isArray(right);

    if (bothObjects) {
      entries.push(...diffAppSpecs(left, right, path));
      continue;
    }

    if (JSON.stringify(left) !== JSON.stringify(right)) {
      entries.push({ path, type: "modified", before: left, after: right });
    }
  }

  return entries;
}
