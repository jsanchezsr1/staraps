export type StoragePutResult = {
  key: string;
  url?: string;
};

export type StorageProvider = {
  putFile(input: { key: string; filePath: string; contentType?: string }): Promise<StoragePutResult>;
  getSignedDownloadUrl(input: { key: string; expiresInSeconds?: number }): Promise<string>;
};
