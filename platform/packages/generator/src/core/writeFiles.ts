import fs from "fs-extra";
import path from "path";

export async function writeGeneratedFiles(baseOutputDir: string, files: Array<{ relativePath: string; content: string }>): Promise<void> {
  for (const file of files) {
    const target = path.join(baseOutputDir, file.relativePath);
    await fs.ensureDir(path.dirname(target));
    await fs.writeFile(target, file.content, "utf8");
  }
}
