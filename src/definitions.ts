export interface ZipPluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
