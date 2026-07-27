import { readFile, BaseDirectory } from '@tauri-apps/plugin-fs';

/**
 * Helper class for reading and writing blocks of data to and from files. \
 * Data is exclusively handled as ArrayBuffers, must be serialized and deserialized by the caller.
 */
export class DataStorageService {

    static async readFile(filePath: string): Promise<Uint8Array<ArrayBuffer>> {
        
        const contents = await readFile(filePath, {
            baseDir: BaseDirectory.AppData,
            encoding: 'binary'
        });
        
        return contents;
        
    }

}