import { registerPlugin } from '@capacitor/core';

import type { ZipPluginPlugin } from './definitions';

const ZipPlugin = registerPlugin<ZipPluginPlugin>('ZipPlugin', {
  web: () => import('./web').then((m) => new m.ZipPluginWeb()),
});

export * from './definitions';
export { ZipPlugin };
