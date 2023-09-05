import { Database } from 'sqlite3';
import * as Tp from 'Type';
import SingleWord2 from 'SingleWord2';
export default class VocaSqlite {
    constructor(props: {
        _dbName?: string;
        _dbPath?: string;
        _tableName: string;
    });
    private _dbName;
    get dbName(): string;
    set dbName(v: string);
    private _dbPath;
    get dbPath(): string;
    set dbPath(v: string);
    private _tableName;
    get tableName(): string;
    set tableName(v: string);
    private _db;
    get db(): Database;
    /**
     * 創建單詞表
     * @param db
     * @param table
     * @returns
     */
    static creatTable(db: Database, table: string): Promise<unknown[]>;
    creatTable(): Promise<unknown[]>;
    /**
     * 備份表、默認表名 newName=table+Ut.YYYYMMDDHHmmssSSS()
     * @param db
     * @param table
     * @param newName
     * @returns
     */
    static backupTable(db: Database, table: string, newName?: string): Promise<unknown[]>;
    backupTable(newName?: string): Promise<unknown[]>;
    /**
     * 添加單詞數組。返回變更˪ᵗid數組。
     * @param db
     * @param table
     * @param words
     * @returns
     */
    static addWords(db: Database, table: string, words: SingleWord2[]): Promise<number[]>;
    addWords(words: SingleWord2[]): Promise<number[]>;
    /**
     * 添加單詞數組。返回Promise對象數組。
     * @param db
     * @param table
     * @param words
     * @returns
     */
    /**
     * 由詞形查詢單詞。返回ᵗ單詞數組中ling字段與表名 同。
     * @param db
     * @param table
     * @param wordShape
     * @returns
     */
    static qryWordByWordShape(db: Database, table: string, wordShape: string): Promise<Tp.IVocaRow[]>;
    /**
     * 添加一個單詞。若所加之詞既存于數據庫則取併集。
     * @param db
     * @param table
     * @param word
     * @returns 返 數據庫中改˪ᵗid。若 欲加ᵗ詞 與 數據庫中既存ᵗ詞ˋ併ᵣ後相同、則返undefined
     */
    private static addOneWord;
    /**
     * 在數據庫中覆蓋指定id處之單詞
     * @param db
     * @param table
     * @param word
     * @param id
     * @returns
     */
    private static setWordByOneId;
    /**
     * 用transaction批量ᵈ由id蔿行重設詞。
     * @param db
     * @param table
     * @param words
     * @param ids
     * @returns
     */
    static setWordsByIds(db: Database, table: string, words: SingleWord2[], ids: number[]): Promise<unknown[]>;
    setWordsByIds(words: SingleWord2[], ids: number[]): Promise<unknown[]>;
    /**
     * 由詞ˉ對象生成 改ᵗsql語句。
     * @param table
     * @param word
     * @param id
     * @returns
     */
    static getUpdateByIdSql(table: string, word: SingleWord2, id: number): [string, any[]];
    /**
     * 由詞ˉ對象生成 增ᵗsql語句。
     * @param table
     * @param word
     * @returns
     */
    static getInsertSql(table: string, word: SingleWord2): [string, any[]];
    static getAllWords(db: Database, table: string): Promise<Tp.IVocaRow[]>;
    getAllWords(): Promise<Tp.IVocaRow[]>;
}
