import { CacheBase, CacheElement } from "./CacheBase";
import { Serializer } from "./Serializer";
import { DataStorageService } from "../../services/storage/DataStorageService";

/**
 * Cache that can be saved/loaded from a binary file.
 * @template T The type of the elements in the cache.
 * @template D Structure of the data to be serialized/deserialized.
 */
export abstract class SavedCacheBase<T extends CacheElement, D extends { id: number, [key: string]: any }> extends CacheBase<T> {

    abstract serializer: Serializer<D>;
    
    /** The path to the file where the data is saved/loaded from. */
    abstract filePath: string;

    /** Serialize an element to the structure D. */
    abstract serializeElement(element: T): D;

    /** Deserialize the structure D to an element. */
    abstract deserializeElement(data: D): T;

    /** Were all the elements loaded from the file? */
    private allElementsLoaded = false;

    /** Serialize all elements and write them to disk. */
    async saveAll(): Promise<void> {
        const objects: D[] = [];
        for (const element of this.values()) {
            const serialized = this.serializeElement(element);
            objects.push(serialized);
        }
        await DataStorageService.writeFile(this.filePath, this.serializer.serializeMany(objects));
    }

    /** Append a new element to the cache and save it to disk. Will assign and return a new ID. */
    async appendElement(element: Omit<T, 'id'>): Promise<number> {
        const newId = this.getNextId();
        const newElement = { ...element, id: newId } as T;
        this.add(newElement);

        await DataStorageService.appendFile(this.filePath, this.serializer.serialize(this.serializeElement(newElement)));
        return newId;
    }

    /**
     * Load all elements from disk and populate the cache. Does nothing if the file does not exist.
     * @param force If true, will reload the elements even if they were already loaded.
     */
    async loadAll(force = false): Promise<void> {
        if (this.allElementsLoaded && !force) return;

        this.clear();

        if (await DataStorageService.fileExists(this.filePath)) {
            const buffer = await DataStorageService.readFile(this.filePath);
            const objects = this.serializer.deserializeMany(buffer);
            for (const obj of objects) {
                const element = this.deserializeElement(obj);
                this.add(element);
                this.allElementsLoaded = true;
            }
        }
    }

}