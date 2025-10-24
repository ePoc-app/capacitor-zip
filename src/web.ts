import { WebPlugin } from '@capacitor/core';

import type { ZipPluginPlugin } from './definitions';

export class ZipPluginWeb extends WebPlugin implements ZipPluginPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
