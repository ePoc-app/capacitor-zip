import { WebPlugin } from '@capacitor/core';
import JSZip from 'jszip';

import type { ZipPlugin, ZipOptions } from './definitions';

// Type definitions for the Capacitor Filesystem API
interface FilesystemPlugin {
  readFile(options: { path: string }): Promise<{ data: string }>;
  appendFile(options: {
    path: string;
    data: string;
    directory: string;
  }): Promise<void>
}

// Extend Window interface to include Capacitor
declare global {
  interface Window {
    Capacitor?: {
      Plugins?: {
        Filesystem?: FilesystemPlugin;
      };
    };
  }
}

export class ZipWeb extends WebPlugin implements ZipPlugin {

  zip(): Promise<{ success: boolean; message?: string }> {
    return Promise.resolve({ success: false, message: 'ZIP functionality is not implemented on web.' });
  }
  async unzip(options: ZipOptions): Promise<{ success: boolean; message?: string }> {
    const filesystem = window.Capacitor?.Plugins?.Filesystem;

    if (!filesystem) {
      return Promise.resolve({ success: false, message: 'Capacitor Filesystem plugin is not available.' });
    }

    try {
      const { source, destination } = options;

      // Retrieve the ZIP file from the app's IndexedDB
      const {data: zipContent} = await filesystem.readFile({
        path: source,
      });

      if (!zipContent) {
        throw new Error(`ZIP file not found in IndexedDB at path: ${source}`);
      }

      // Extract the ZIP file using JSZip
      const zip = await JSZip.loadAsync(zipContent, {base64: true});

      // Extract Filesystem directory and path from destination path
      const directories = ['DATA', 'DOCUMENTS', 'CACHE', 'EXTERNAL', 'EXTERNAL_STORAGE', 'EXTERNAL_CACHE', 'TEMPORARY', "LIBRARY", "LIBRARY_NO_CLOUD"];
      const pathParts = destination.split('/');
      const directory = directories.includes(pathParts[1] as any) ? pathParts[1] as any : 'DATA';
      const destPath = directories.includes(pathParts[1] as any) ? pathParts.slice(2).join('/') : pathParts.slice(1).join('/');

      // Iterate over each file in the ZIP
      const files = Object.keys(zip.files);
      for (const fileName of files) {
        const file = zip.files[fileName];
        if (!file.dir) { // Skip directories
          const fileContent = await file.async('base64');
          const filePath = `${destPath}/${fileName}`;

          // Store the extracted file in the destination IndexedDB
          await filesystem.appendFile({
            path: filePath,
            data: fileContent,
            directory
          });
        }
      }

      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message };
    }
  }
}
