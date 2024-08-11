import { RimeConfig } from "./RimeConfig";
import { CntWordDbSrc } from "./db/CntWord/CntWordDbSrc";
import { SqliteDb } from "@backend/sqlite/Sqlite";

export const configInst = await RimeConfig.GetInst()
const config = configInst.config
export const commitHistorySqliteDb = SqliteDb.fromPath(config.commitHistory.sqlitePath)
export const cntWordDbSrc = CntWordDbSrc.new(commitHistorySqliteDb)

