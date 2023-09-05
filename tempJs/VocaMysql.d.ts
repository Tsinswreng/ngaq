import * as mysql2 from 'mysql2/promise';
import VocaSqlite from './VocaSqlite';
export default class VocaMysql {
    constructor(pool: mysql2.PoolOptions);
    private _pool;
    get pool(): mysql2.Pool;
    static getAllWords<T>(pool: mysql2.Pool, table: string): Promise<T[]>;
    getAllWords<T>(table: string): Promise<T[]>;
    /**
     * 單詞ˇ舊mysql表ᙆ新式ᵗsqliteᵗ詞表ʰ複製。
     * @param pool
     * @param table
     * @param liteInst
     * @returns
     */
    static toSqliteTable_forOld(pool: mysql2.Pool, table: string, liteInst: VocaSqlite): Promise<number[]>;
    toSqliteTable_forOld(table: string, liteInst: VocaSqlite): Promise<number[]>;
}
