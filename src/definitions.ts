export interface ZipPlugin {
  zip(options: { source: string; destination: string }): Promise<{ success: boolean; message?: string }>;
  unzip(options: { source: string; destination: string }): Promise<{ success: boolean; message?: string }>;
}

export interface ZipOptions {
  source: string;
  destination: string;
}
