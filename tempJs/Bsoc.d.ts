import { DictRaw, DictDb } from "./Dict";
import { RegexReplacePair } from 'Type';
export interface IPhonology {
    kanjis: Kanji[];
}
export declare class Phonology {
    private _raw;
    get raw(): DictRaw;
    static 賦讀音和漢字對象數組(validBody: string[][], kanjis: Kanji[], 音arr: string[]): void;
}
export declare class Bsoc {
    raw: DictRaw;
    db: DictDb;
    onsetMap: Map<string, number>;
    p2Map: Map<string, number>;
    p3Map: Map<string, number>;
    kanjis: Kanji[];
    syllable: ChieneseSyllable[];
    regexps: RegExp[];
    replacePairMap: Map<RegExp, string>;
    replacePair預處理: {
        regex: RegExp;
        replacement: string;
    }[];
    replacePair音節分割: RegexReplacePair[];
    音strArr: (string | undefined)[];
    fullIpaStrArr: string[];
    無括號橫槓之音: string[];
    非三等標記: string;
    取讀音數組(): void;
    除中尖括號橫槓r(): void;
    static 除中尖括號橫槓r(strArr: string[]): string[];
    static 除拼音r(strArr: string[]): string[];
    預處理(): void;
    static 聲明合併r(strArr: string[]): string[];
    聲明合併(): void;
    音節分割_聲明合併(): void;
    檢查音節分割是否正確(): void;
    非三等標記統一置于元音前(): void;
    統計出現次數(): void;
    creatTable(): Promise<any>;
    insertIntoDb(kanjis: Kanji[]): Promise<unknown>;
    static run(): Promise<void>;
}
export declare class Kanji {
    kanji?: string;
    syllable: ChieneseSyllable;
    constructor(props?: Partial<Kanji>);
}
export declare class ChieneseSyllable {
    whole?: string;
    onset?: string;
    medial?: string;
    vowel?: string;
    coda?: string;
    tone?: string;
    get p2(): string | undefined;
    get p3(): string | undefined;
    constructor(props?: Partial<ChieneseSyllable>);
}
export declare class OcOnset {
    whole?: string;
}
export declare class OcP2 {
    whole?: string;
}
export declare class BsocP3 {
    whole?: string;
}
export declare class OcMedial {
}
export declare class OcVowel {
}
export declare class OcCoda {
}
export declare class OcTone {
}
export declare class Msoc {
    raw: DictRaw;
    kanjis: Kanji[];
    pronounceArr: string[];
    assign(): void;
    豫處理(): void;
    static run(): void;
}
