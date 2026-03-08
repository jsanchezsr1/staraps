import fs from "fs-extra";
import path from "path";
import archiver from "archiver";

export async function archiveOutput(outputDir: string): Promise<string> {
  const zipPath = path.join(outputDir, "generated-app.zip");
  await fs.ensureDir(path.dirname(zipPath));
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", () => resolve(zipPath));
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(path.join(outputDir, "app"), "app");
    archive.finalize();
  });
}
