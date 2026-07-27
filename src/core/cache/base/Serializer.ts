/* Fichier adapté depuis le projet "Anonymex", organisé au sein de l'Université de Montpellier. */

type ChampType =
    | "int8" // max 127
    | "uint8" // max 255
    | "int16" // max 32 767
    | "uint16" // max 65 535
    | "uint64"
    | "string"
    | "boolean";

interface Champ<T> {
    nom: keyof T, // clé/prop de l'instance à sérialiser
    type: ChampType,
    nullable?: boolean,
}

type Schema<T> = Champ<T>[];
 
/**
 * Concatène plusieurs Uint8Array en un seul (équivalent de Buffer.concat).
 */
function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
    const longueurTotale = arrays.reduce((somme, arr) => somme + arr.length, 0);
    const resultat = new Uint8Array(longueurTotale);
    let offset = 0;
    for (const arr of arrays) {
        resultat.set(arr, offset);
        offset += arr.length;
    }
    return resultat;
}

/**
 * Sérialise et désérialise les éléments en cache pour les sauvegardes au format binaire (`.anonymex`).
 * Compatible navigateur / Tauri (utilise Uint8Array + DataView au lieu de Buffer, indisponible
 * côté frontend d'une app Tauri).
 * @template T Type de l'élément en cache à sérialiser/désérialiser
 */
export class Serializer<T extends { id: number, [key: string]: any }> {
    private schema: Schema<T>;
    private static readonly encoder = new TextEncoder();
    private static readonly decoder = new TextDecoder('utf-8');

    /**
     * @param schema Schéma de sérialisation de l'élément en cache \
     * (int8 = max 127, uint8 = max 255, int16 = max 32 767, uint16 = max 65 535)
     */
    constructor(schema: Schema<T>) {
        this.schema = schema;
    }

    /**
     * Sérialiser un élément en format binaire.
     * @param data Données brutes à sérialiser
     * @returns Uint8Array contenant les données sérialisées
     */
    public serialize(data: T): Uint8Array {
        const morceaux: Uint8Array[] = [];

        for (const champ of this.schema) {
            // pour chaque champ
            const valeur = data[champ.nom];

            // Ajoute un octet de présence si le champ est nullable
            // e.g. '0' si la val est nulle, '1' sinon, suivi de la valeur si elle est présente
            if (valeur == null) {
                if (!champ.nullable) {
                    throw new Error(`Le champ ${(String(champ.nom))} ne peut pas être null lors de la sérialisation.`);
                }

                morceaux.push(new Uint8Array([0]));
                continue;
            }

            if (champ.nullable) {
                morceaux.push(new Uint8Array([1]));
            }

            let champBuffer: Uint8Array;

            switch (champ.type) {
                case "int8": {
                    champBuffer = new Uint8Array(1);
                    new DataView(champBuffer.buffer).setInt8(0, valeur as number);
                    break;
                }
                case "uint8": {
                    champBuffer = new Uint8Array(1);
                    new DataView(champBuffer.buffer).setUint8(0, valeur as number);
                    break;
                }
                case "int16": {
                    champBuffer = new Uint8Array(2);
                    new DataView(champBuffer.buffer).setInt16(0, valeur as number, false);
                    break;
                }
                case "uint16": {
                    champBuffer = new Uint8Array(2);
                    new DataView(champBuffer.buffer).setUint16(0, valeur as number, false);
                    break;
                }
                case "uint64": {
                    champBuffer = new Uint8Array(8);
                    // caster en bigint pour éviter approx. ou débordement
                    const bigVal = typeof valeur === 'bigint' ? valeur : BigInt(valeur as number);
                    new DataView(champBuffer.buffer).setBigUint64(0, bigVal, false);
                    break;
                }
                case "string": {
                    // écrire la longueur de la str (sur 2 octets) + la str en utf-8
                    const strVal = valeur as string;
                    const strBuffer = Serializer.encoder.encode(strVal);
                    const lengthBuffer = new Uint8Array(2);
                    new DataView(lengthBuffer.buffer).setUint16(0, strBuffer.length, false);
                    champBuffer = concatUint8Arrays([lengthBuffer, strBuffer]);
                    break;
                }
                case "boolean": {
                    champBuffer = new Uint8Array([(valeur as boolean) ? 1 : 0]);
                    break;
                }
                default:
                    throw new Error(`Type de champ inconnu pour la sérialisation : ${(champ.type)}`);
            }

            morceaux.push(champBuffer);
        }

        return concatUint8Arrays(morceaux);
    }

    /**
     * Sérialiser plusieurs objets en un seul buffer concaténé.
     * @param dataList Liste des objets à sérialiser
     * @returns Uint8Array contenant les données sérialisées concaténées
     */
    public serializeMany(dataList: T[]): Uint8Array {
        const buffers: Uint8Array[] = dataList.map(data => this.serialize(data));
        return concatUint8Arrays(buffers);
    }

    /**
     * Désérialiser un buffer en un schema d'instance de l'élément en cache.
     * @param buffer Uint8Array contenant les données sérialisées
     * @returns SCHEMA de l'instance désérialisée
     */
    public deserialize(buffer: Uint8Array): Partial<T> {
        return this.deserializeAvecOffset(buffer, 0).data;
    }

    /**
     * Désérialiser un buffer contenant plusieurs instances sérialisées.
     * @param buffer Uint8Array contenant les données sérialisées (concaténation d'instances)
     * @returns Liste des instances désérialisées
     */
    public deserializeMany(buffer: Uint8Array): T[] {
        const instances: T[] = [];
        let offset = 0;

        while (offset < buffer.length) {
            const { data: instance, offset: nextOffset } = this.deserializeAvecOffset(buffer, offset);

            if (nextOffset <= offset) {
                throw new Error("La désérialisation n'a pas progressé, buffer potentiellement invalide.");
            }

            instances.push(instance);
            offset = nextOffset;
        }

        return instances;
    }

    private deserializeAvecOffset(buffer: Uint8Array, startOffset: number): {
        data: T,
        offset: number,
    } {
        const data: Partial<T> = {};
        let offset = startOffset;
        const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

        for (const champ of this.schema) {
            if (champ.nullable) {
                const isPresent = view.getUint8(offset);
                offset += 1;

                if (!isPresent) {
                    data[champ.nom] = null as T[typeof champ.nom];
                    continue;
                }
            }

            let valeur: string | number | boolean | bigint;

            switch (champ.type) {
                case "int8":
                    valeur = view.getInt8(offset);
                    offset += 1;
                    break;
                case "uint8":
                    valeur = view.getUint8(offset);
                    offset += 1;
                    break;
                case "int16":
                    valeur = view.getInt16(offset, false);
                    offset += 2;
                    break;
                case "uint16":
                    valeur = view.getUint16(offset, false);
                    offset += 2;
                    break;
                case "uint64":
                    valeur = view.getBigUint64(offset, false);
                    offset += 8;
                    break;
                case "string": {
                    const length = view.getUint16(offset, false);
                    offset += 2;
                    valeur = Serializer.decoder.decode(buffer.subarray(offset, offset + length));
                    offset += length;
                    break;
                }
                case "boolean": {
                    valeur = view.getUint8(offset) === 1;
                    offset += 1;
                    break;
                }
                default:
                    throw new Error(`Type de champ inconnu pour la désérialisation : ${(champ.type)}`);
            }

            data[champ.nom] = valeur as T[typeof champ.nom];
        }

        return {
            data: data as T,
            offset,
        };
    }
}