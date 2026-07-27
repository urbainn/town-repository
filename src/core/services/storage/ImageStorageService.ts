import { writeFile, remove, exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/core';

/**
 * Helper class for managing workspace images.
 */
export class ImageStorageService {
    
    // Sub-folder (relative to the AppData directory) where images are stored.
    private static readonly IMAGE_DIR = 'images';

    /**
     * Guarantees that the image directory exists, creates it otherwise.
     */
    private static async ensureDir(): Promise<void> {
        const dirExists = await exists(this.IMAGE_DIR, { baseDir: BaseDirectory.AppData });
        if (!dirExists) {
            await mkdir(this.IMAGE_DIR, { baseDir: BaseDirectory.AppData, recursive: true });
        }
    }

    /**
     * Saves an image. Overwrites any existing image with the same filename.
     */
    static async saveImage(fileName: string, data: Uint8Array | ArrayBuffer): Promise<void> {
        await this.ensureDir();
        
        const filePath = await join(this.IMAGE_DIR, fileName);
        const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
        
        await writeFile(filePath, bytes, {
            baseDir: BaseDirectory.AppData
        });
    }

    /**
     * Deletes an image from the workspace if it exists (fails silently if it doesn't).
     */
    static async deleteImage(fileName: string): Promise<void> {
        const filePath = await join(this.IMAGE_DIR, fileName);
        const fileExists = await exists(filePath, { baseDir: BaseDirectory.AppData });
        
        if (fileExists) {
            await remove(filePath, { baseDir: BaseDirectory.AppData });
        }
    }

    /**
     * Generate a URL for a workspace image that can be used in the frontend.
     */
    static async getImageUrl(fileName: string): Promise<string> {
        const appDataPath = await appDataDir();
        const absolutePath = await join(appDataPath, this.IMAGE_DIR, fileName);
        
        return convertFileSrc(absolutePath);
    }
}