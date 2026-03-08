import type { StorageProvider, StoragePutResult } from "./types";

export class S3CompatibleStorageProvider implements StorageProvider {
  constructor(private config: {
    bucket: string;
    region?: string;
    endpoint?: string;
  }) {}

  async putFile(input: { key: string; filePath: string }): Promise<StoragePutResult> {
    return {
      key: input.key,
      url: this.buildUrl(input.key)
    };
  }

  async getSignedDownloadUrl(input: { key: string; expiresInSeconds?: number }): Promise<string> {
    const expiry = input.expiresInSeconds || 3600;
    return `${this.buildUrl(input.key)}?signed=stub&expiresIn=${expiry}`;
  }

  private buildUrl(key: string) {
    if (this.config.endpoint) {
      return `${this.config.endpoint.replace(/\/$/, "")}/${this.config.bucket}/${key}`;
    }
    const region = this.config.region || "us-east-1";
    return `https://${this.config.bucket}.s3.${region}.amazonaws.com/${key}`;
  }
}
