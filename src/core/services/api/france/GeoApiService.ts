export interface CommuneGeoInfo {
    nom: string;
    code: string;
    codeDepartement: string;
    siren: string;
    codeEpci: string;
    codeRegion: string;
    codesPostaux: string[];
    population: number;
} 

/**
 * `geo.api.gouv.fr` wrapper for fetching commune information based on INSEE/LAU.
 */
export class GeoApiService {

    private static readonly BASE_URL = 'https://geo.api.gouv.fr/communes';

    /**
     * LAU/INSEE code to commune info.
     * @param lauCode The LAU/INSEE code of the commune.
     */
    static async getCommuneInfo(lauCode: string): Promise<CommuneGeoInfo> {
        const url = `${this.BASE_URL}/${lauCode}?fields=nom,code,codeDepartement,siren,codeEpci,codeRegion,codesPostaux,population`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    /**
     * Get communes by postal code.
     * @param postalCode The postal code to search for.
     * @returns array of communes info.
     */
    static async getCommunesByPostalCode(postalCode: string): Promise<CommuneGeoInfo[]> {
        const url = `${this.BASE_URL}?codePostal=${postalCode}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    
}