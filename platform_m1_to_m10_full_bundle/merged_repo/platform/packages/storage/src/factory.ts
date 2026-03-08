import { env } from "@platform/shared";
import { LocalStorageProvider } from "./localProvider";
import { S3CompatibleStorageProvider } from "./s3Provider";
import type { StorageProvider } from "./types";

export function makeStorageProvider(): StorageProvider {
  const bucket = process.env.S3_BUCKET;
  if (bucket) {
    return new S3CompatibleStorageProvider({
      bucket,
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT
    });
  }

  return new LocalStorageProvider(env("LOCAL_STORAGE_ROOT", "/tmp/platform-storage"));
}
