import fs from "fs-extra";
import path from "path";
import type { StorageProvider, StoragePutResult } from "./types";

export class LocalStorageProvider implements StorageProvider {
  constructor(private rootDir: string) {}

  async putFile(input: { key: string; filePath: string }): Promise<StoragePutResult> {
    const target = path.join(this.rootDir, input.key);
    await fs.ensureDir(path.dirname(target));
    await fs.copy(input.filePath, target);
    return {
      key: input.key,
      url: `file://${target}`
    };
  }

  async getSignedDownloadUrl(input: { key: string }): Promise<string> {
    const target = path.join(this.rootDir, input.key);
    return `file://${target}`;
  }
}
