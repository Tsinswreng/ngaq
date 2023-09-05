import * as Tp from 'Type';
export default class User {
    constructor(props: {
        _strId: string;
        _userName: string;
        _password: string;
        _mail: string;
    });
    private _id?;
    get id(): number | undefined;
    private _strId;
    get strId(): string;
    private _userName;
    get userName(): string;
    private _password;
    get password(): string;
    private _mail;
    get mail(): string;
    private _date;
    get date(): number;
    static toRowObj(inst: User): Tp.IUser;
    static parse(obj: Tp.IUser): User;
}
