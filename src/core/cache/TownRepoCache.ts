import { CacheElement } from "./base/CacheBase";
import { SavedCacheBase } from "./base/SavedCacheBase";
import { Serializer } from "./base/Serializer";

export enum TownType {
    Town,
    Intercommunity,
    Department,
    Region
}

export interface TownRepoData {
    id: number;
    uuid: string;
    townName: string;
    townType: TownType;
    primaryColour: string;
    secondaryColour: string;
    /** Comma-separated */
    townLAUcodes: string;
    lastSaved: number;
}

export class TownRepo implements CacheElement {
    id: number;
    uuid: string;
    townName: string;
    townType: TownType;
    
    primaryColour: string;
    secondaryColour: string;
    townLAUcodes: string[];

    /** Last time the project was properly saved/backed up */
    lastSaved: number;

    constructor(id: number, uuid: string, townName: string, townType: TownType, primaryColour: string, secondaryColour: string, townLAUcodes: string, lastSaved: number) {
        this.id = id;
        this.uuid = uuid;
        this.townName = townName;
        this.townType = townType;
        this.primaryColour = primaryColour;
        this.secondaryColour = secondaryColour;
        this.townLAUcodes = townLAUcodes.split(",").map(code => code.trim());
        this.lastSaved = lastSaved;
    }

}

export class TownRepoCache extends SavedCacheBase<TownRepo, TownRepoData> {

    serializer = new Serializer<TownRepoData>([
        { nom: "id", type: "uint16" },
        { nom: "uuid", type: "string" },
        { nom: "townName", type: "string" },
        { nom: "townType", type: "uint8" },
        { nom: "primaryColour", type: "string" },
        { nom: "secondaryColour", type: "string" },
        { nom: "townLAUcodes", type: "string" },
        { nom: "lastSaved", type: "uint64" }
    ]);

    filePath = "townRepo.bin";

    serializeElement(element: TownRepo): TownRepoData {
        return {
            id: element.id,
            uuid: element.uuid,
            townName: element.townName,
            townType: element.townType,
            primaryColour: element.primaryColour,
            secondaryColour: element.secondaryColour,
            townLAUcodes: element.townLAUcodes.join(","),
            lastSaved: element.lastSaved
        };
    }

    deserializeElement(data: TownRepoData): TownRepo {
        return new TownRepo(data.id, data.uuid, data.townName, data.townType, data.primaryColour, data.secondaryColour, data.townLAUcodes, data.lastSaved);
    }

}

export const townRepoCacheInstance = new TownRepoCache();