export declare class GetCompiledJs {
    private _dir;
    private _filePaths;
    private _outJsFiles;
    constructor(dir?: string);
    set dir(v: string);
    get dir(): string;
    set filePaths(v: string[]);
    get filePaths(): string[];
    set outJsFiles(v: string[]);
    get outJsFiles(): string[];
    run(dir?: string): void;
    tempMoveJs(targetDir: string): void;
    static traverseDirectory(folderPath: string): string[];
    static test(): void;
}
