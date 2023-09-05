import 'module-alias/register';
import { Database } from 'sqlite3';
import { RegexReplacePair } from 'Type';
import * as Tp from 'Type';
import { DictDbRow, DictRawConfig } from 'Type';
/**
 * 音節
 */
/**
 * 最小對立對
 */
export declare class MinimalPairUtil {
    constructor(props?: Partial<Kanji>);
    /**
     * pair的每個元素都是一對最小對立對、第二維長度皆是2 如pair[1][0].code 潙'ta'、pair[1][1].code 潙'tʰa'
     */
    private _pairs;
    get pairs(): MinimalPairUtil[];
    set pairs(v: MinimalPairUtil[]);
    /**
     * 蔿 諸 最小對立對 算 字頻之和
     * @param db
     * @param table
     * @param pairs 諸 最小對立對
     * @returns 長度潙二的 數組。 第一個元素是諸最小對立對中包含第一個音位的字的字頻之和、第二個同理。
     */
    static sumFreq(db: Database, table: string, pairs: Tp.MinimalPair[]): Promise<number[]>;
    /**
     * 算字頻之和。考慮除重。
     * @param pairs
     * @param side 0對應左邊的音位、1對應右邊的音位。不填則返回左右的和。
     * @returns
     */
    static sumFreq_deprecated(pairs: DictDbRow[][], side?: 0 | 1): number;
    /**
     * 把MinimalPair[] 類型的最小對立對 數組 轉成 DictDbRow[][]類型的。
     */
    static filterComplementary(pairs: Tp.MultiMinimalPairs[]): void;
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
    p2?: string;
    p3?: string;
    get combined(): string | undefined;
    get combined_p2(): string | undefined;
    get combined_p3(): string | undefined;
    constructor(props?: Partial<ChieneseSyllable>);
}
/**
 * 音節內的片段
 */
/**
 * 漢字
 */
export declare class Dict {
    constructor(props: Partial<Dict>);
    static readonly L_ALPHABET = "abcdefghijklmnopqrstuvwxyz";
    private _rawObj;
    get rawObj(): DictRaw;
    set rawObj(v: DictRaw);
    private _name;
    get name(): string;
    set name(v: string);
    private _dbObj;
    get dbObj(): DictDb;
    private _重碼頻數?;
    get 重碼頻數(): number | undefined;
    private _無重複漢字數?;
    get 無重複漢字數(): number | undefined;
    private _無重複音節數?;
    get 無重複音節數(): number | undefined;
    private _字頻總和?;
    get 字頻總和(): number | undefined;
    private _加頻重碼率?;
    get 加頻重碼率(): number | undefined;
    private _pronounceArr;
    get pronounceArr(): string[];
    set pronounceArr(v: string[]);
    private _kanjis;
    get kanjis(): Kanji[];
    set kanjis(v: Kanji[]);
    static getSimpleHead(name: string): string;
    getUpdatedKanjis(validBody?: string[][], pronounceArr?: string[]): Kanji[];
    get_pronounceArr(validBody?: string[][]): string[];
    assign_pronounceArr(): void;
    /**
     *
     * @param min 若填則不慮字頻小於此者
     */
    get_重碼頻數(min?: number): Promise<number>;
    get_字頻總和(min?: number): Promise<number>;
    /**
     * 臨時用
     * @param db
     * @param table
     * @param min
     * @returns
     */
    static 篩頻(db: Database, table: string, min: number): Promise<unknown[]>;
    assign_重碼頻數(min?: number): Promise<void>;
    preprocess(replacePair: RegexReplacePair[], pronounceArr?: string[]): void;
    getRawDividedSyllable(replacePair: RegexReplacePair[], pronounceArr?: string[]): string[];
    /**
     * 示例 phraws
     * let r = 首介腹尾調_分割('首1ph首2介1r介2腹1a腹2尾1w尾2調1s調2', new ChieneseSyllable())
     * 返回的r是一個ChieneseSyllable實例、有onset到tone等等。
     * @param str
     * @param oldSyllableObj
     * @param pattern
     * @returns
     */
    static 首介腹尾調_分割(str: string, oldSyllableObj: ChieneseSyllable, pattern?: RegExp): ChieneseSyllable;
    static 三分arr(str: string[], pattern?: RegExp): ChieneseSyllable[];
    static 三分(str: string, oldSyllableObj: ChieneseSyllable, pattern?: RegExp): ChieneseSyllable;
    static getOccurrenceTimesMap(syllables: ChieneseSyllable[], field: keyof ChieneseSyllable): Map<string, number>;
    static 批量取分割後ᵗ音節對象(): void;
    countAll(): Promise<void>;
    算加頻重碼率(min?: number): void;
    putInfo(): Promise<void>;
    各排列ˋ轄字ᵗ分析(): Promise<void>;
    saffes韻母轄字統計(newTableName: string): Promise<void>;
    recoverBody(pronounceArr?: string[], validBody?: string[][]): any;
    outputToFile(path: string, head?: string): void;
    update(): Promise<void>;
    static zyenphengToOc(): void;
}
/**
 * [23.07.08-2146,]
 * 用于處理字表、如rime輸入法之dict.yaml, 音韻學/方言字表等
 */
export declare class DictRaw {
    private _singleCharMode;
    private _name?;
    private _srcPath?;
    private _splitter;
    private _srcStr;
    private _srcLines;
    private _header;
    private _indexOfHeader;
    private _validBody;
    set srcLines(v: string[]);
    get srcLines(): string[];
    set validBody(v: string[][]);
    get validBody(): string[][];
    set srcStr(v: string);
    get srcStr(): string;
    set indexOfHeader(v: number);
    get indexOfHeader(): number;
    set header(v: string);
    get header(): string;
    set name(v: string | undefined);
    get name(): string | undefined;
    set splitter(v: string);
    get splitter(): string;
    set srcPath(v: string | undefined);
    get srcPath(): string | undefined;
    constructor(config: DictRawConfig);
    assign_srcStr(path?: string | undefined): void;
    assign_tableArr(): void;
    get_indexOfHeader(): number | null;
    get_header(): string;
    getOriginNameInDictYaml(): string | undefined;
    assign_name(): void;
    /**
     * 取 有效表身
     */
    assign_validBody(singleCharMode?: boolean): void;
    assign_srcLines(): void;
    static getDictYamlPaths(userPath?: string): string[];
    static 轉置後連續替換(body: string[][], index: number, replacePair: RegexReplacePair[]): string[];
}
export declare class DictDb {
    private _dbName;
    get dbName(): string;
    set dbName(v: string);
    private _dbPath;
    private _essayPath;
    get essayPath(): string;
    set essayPath(v: string);
    private _tableName?;
    private _essayName;
    get essayName(): string;
    set essayName(v: string);
    private _db;
    constructor(props: Partial<DictDb>);
    get dbPath(): string;
    set dbPath(v: string);
    set tableName(v: string | undefined);
    get tableName(): string | undefined;
    get db(): Database;
    isTableExists(tableName?: string | undefined): Promise<boolean>;
    static creatTable(db: Database, tableName: string): Promise<unknown[]>;
    creatTable(tableName?: string | undefined): Promise<unknown[]>;
    insert(data: DictDbRow[] | string[][]): Promise<unknown>;
    attachFreq(): Promise<void>;
    /**
     * 依照八股文 在表中爲每個字附上字頻
     * @param db
     * @param tableName
     * @param essayTableName
     */
    static attachFreq(db: Database, tableName: string, essayTableName?: string): Promise<void>;
    static putNewTable(dictRaw: DictRaw): Promise<void>;
    putNewTable(dictRaw: DictRaw, preprocess?: RegexReplacePair[]): Promise<void>;
    static serialReplace(db: Database, table: string, column: string, replacementPair: RegexReplacePair[]): Promise<void>;
    static toObjArr(strArr: string[][]): DictDbRow[];
    /**
     * 先盡刪表、然後把整個User_Data下的.dict.yaml文件 字表的有效部分添進數據庫
     * @param userPath User_Data的絕對路徑
     */
    static testAll(db: Database, userPath?: string): Promise<void>;
    static selectAll(db: Database, table: string): Promise<Tp.DictDbRow[]>;
    /**
     * 把八股文(字頻表)加進數據庫裏、表名命名爲essay
     * @param path
     */
    static putEssay(db: Database, path?: string, essayName?: string): Promise<unknown>;
    static get重碼頻數(db: Database, tableName: string): Promise<{
        code: string;
        freq_of_homo: number;
    }[]>;
    /**
     * 取 重複項。若char,code,ratio皆同則視爲重複。
     * @param db
     * @param tableName
     * @returns
     */
    static getDuplication(db: Database, tableName: string): Promise<Tp.Duplication[]>;
    /**
     * 刪除重複項、只保留id最大者。若char,code,ratio皆同則視爲重複。
     * @param db
     * @param tableName
     * @returns
     */
    static deleteDuplication(db: Database, tableName: string): Promise<unknown>;
    static copyTransDb(targetDb: Database, srcDb: Database, srcTableName: string): Promise<void>;
    static findMinimalPairs_old2(db: Database, tableName: string, columnName: string, phoneme1: string, phoneme2: string): Promise<Tp.DictDbRow[][]>;
    static findMinimalPairs(rows: DictDbRow[], pattern1: string, p2: string, mode?: string): Tp.MinimalPair[];
    /**
     * 示例
     * let r = await DictDb.multiMinimalPairs(new DictDb({}).db, 'OC_msoeg', '^()(', ')(.*)$', ['p','t','k'], ['b', 'd'], 'asc');console.log(r)
     * 輸出
     *
     * [
        { pair: [ 'k', 'b' ], proportion: 0.026951720981624523 },
        { pair: [ 'p', 'b' ], proportion: 0.029148193756669428 },
        { pair: [ 't', 'b' ], proportion: 0.04542717702311534 },
        { pair: [ 'k', 'd' ], proportion: 0.06330477231253857 },
        { pair: [ 't', 'd' ], proportion: 0.06988718801675056 },
        { pair: [ 'p', 'd' ], proportion: 0.07573960447134613 }
        ]
     *
     * @param db
     * @param table
     * @param leftPattern
     * @param rightPattern
     * @param phoneme1
     * @param phoneme2
     * @param orderBy
     * @returns
     */
    static multiMinimalPairs(db: Database, table: string, leftPattern: string, rightPattern: string, phoneme1: string[], phoneme2?: string[], orderBy?: 'asc' | 'desc'): Promise<Tp.MultiMinimalPairs[]>;
}
