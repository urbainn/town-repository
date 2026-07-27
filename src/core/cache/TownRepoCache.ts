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
    townName: string;
    townType: TownType;
    primaryColour: string;
    secondaryColour: string;
}

export class TownRepo implements CacheElement {
    id: number;
    townName: string;
    townType: TownType;
    
    primaryColour: string;
    secondaryColour: string;
  
    constructor(id: number, townName: string, townType: TownType, primaryColour: string, secondaryColour: string) {
        this.id = id;
        this.townName = townName;
        this.townType = townType;
        this.primaryColour = primaryColour;
        this.secondaryColour = secondaryColour;
    }

}

export class TownRepoCache extends SavedCacheBase<TownRepo, TownRepoData> {

    serializer = new Serializer<TownRepoData>([
        { nom: "id", type: "uint16" },
        { nom: "townName", type: "string" },
        { nom: "townType", type: "uint8" },
        { nom: "primaryColour", type: "string" },
        { nom: "secondaryColour", type: "string" }
    ]);

    filePath = "townRepo.bin";

    serializeElement(element: TownRepo): TownRepoData {
        return {
            id: element.id,
            townName: element.townName,
            townType: element.townType,
            primaryColour: element.primaryColour,
            secondaryColour: element.secondaryColour
        };
    }

    deserializeElement(data: TownRepoData): TownRepo {
        return new TownRepo(data.id, data.townName, data.townType, data.primaryColour, data.secondaryColour);
    }

}

export const townRepoCacheInstance = new TownRepoCache();