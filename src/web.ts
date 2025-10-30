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
    console.log('Filesystem plugin:', filesystem);

    if (!filesystem) {
      return Promise.resolve({ success: false, message: 'Capacitor Filesystem plugin is not available.' });
    }

    try {
      console.log('Unzip called with options:', options);
      const { source, destination } = options;

      // Retrieve the ZIP file from the app's IndexedDB
      const {data: zipContent} = await filesystem.readFile({
        path: source,
      });

      console.log(zipContent);

      if (!zipContent) {
        throw new Error(`ZIP file not found in IndexedDB at path: ${source}`);
      }

      console.log('ZIP file retrieved, loading with JSZip...');

      // Extract the ZIP file using JSZip
      const zip = await JSZip.loadAsync(zipContent, {base64: true});

      console.log('ZIP file loaded, extracting contents...', zip.files);

      // Iterate over each file in the ZIP
      const files = Object.keys(zip.files);
      for (const fileName of files) {
        console.log('Extracting file:', fileName);
        const file = zip.files[fileName];
        if (!file.dir) { // Skip directories
          const fileContent = await file.async('base64');
          const filePath = `${destination}/${fileName}`;

          console.log(`Writing file to IndexedDB at path: ${filePath}`);
          // Store the extracted file in the destination IndexedDB
          await filesystem.appendFile({
            path: filePath,
            data: fileContent,
            directory: "DATA" // todo: extract directory from destination path instead of hardcoding it
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
