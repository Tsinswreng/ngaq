import * as mysql from 'mysql';
export default class MySql {
    private _connect;
    get connect(): mysql.Connection;
    static query(): void;
}
