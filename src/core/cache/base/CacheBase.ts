export interface CacheElement {
    id: number;
}

export abstract class CacheBase<T extends CacheElement> {
    private cache: Map<number, T>;
    protected highestKey: number = 0;

    constructor() {
        this.cache = new Map<number, T>();
    }

    get(key: number): T | undefined {
        return this.cache.get(key);
    }

    private set(key: number, value: T): void {
        this.cache.set(key, value);
        if (key > this.highestKey) { // potential danger: if the entire cache isn't loaded, IDs could be reused. always cache all objects.
            this.highestKey = key;
        }
    }

    has(key: number): boolean {
        return this.cache.has(key);
    }

    delete(key: number): boolean {
        return this.cache.delete(key);
    }

    /** Add an element to the cache. Returns its ID. Throws if already cached. */
    add(value: T): number {
        if (this.has(value.id)) {
            throw new Error(`Element with id ${value.id} already exists in the cache.`);
        }
        this.set(value.id, value);
        return value.id;
    }

    /** Replace an element in the cache. Throws if not found. */
    replace(value: T): void {
        if (!this.has(value.id)) {
            throw new Error(`Element with id ${value.id} does not exist in the cache.`);
        }
        this.set(value.id, value);
    }

    values(): IterableIterator<T> {
        return this.cache.values();
    }

    keys(): IterableIterator<number> {
        return this.cache.keys();
    }

    clear(): void {
        this.cache.clear();
    }

    protected getNextId(): number {
        return ++this.highestKey;
    }
}