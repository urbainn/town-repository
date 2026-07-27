import { readFile, BaseDirectory, open, writeFile, exists } from '@tauri-apps/plugin-fs';

/**
 * Helper class for reading and writing blocks of data to and from files. \
 * Data is exclusively handled as ArrayBuffers, must be serialized and deserialized by the caller.
 */
export class DataStorageService {

    static async readFile(filePath: string): Promise<Uint8Array> {
        return await readFile(filePath, {
            baseDir: BaseDirectory.AppData,
        });
    }

    static async writeFile(filePath: string, data: Uint8Array): Promise<void> {        
        await writeFile(filePath, data, {
            baseDir: BaseDirectory.AppData,
            create: true
        });
    }

    /**
     * Append data to a file.
     */
    static async appendFile(filePath: string, data: Uint8Array): Promise<void> {        
        const file = await open(filePath, {
            baseDir: BaseDirectory.AppData,
            write: true,
            create: true,
            append: true
        });

        try {
            await file.write(data);
        } finally {
            await file.close();
        }
    }
    
    static async fileExists(filePath: string): Promise<boolean> {
        return await exists(filePath, { baseDir: BaseDirectory.AppData });
    }
}