import mysql2 from 'mysql2/promise';
export default class UserMysql {
    constructor(pool: mysql2.PoolOptions);
    private _pool;
    get pool(): mysql2.Pool;
    static creatTable(pool: mysql2.Pool, tableName?: string): void;
}
