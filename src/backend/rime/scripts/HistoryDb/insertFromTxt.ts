import { MkReadNRow } from "@backend/rime/historyDb/ReadFromTxt";
import { historyOpt } from "./opt";
import { stuff } from "./stuff";
import { DbErr } from "@backend/sqlite/Sqlite";
import { LineParseErr } from "@backend/rime/historyDb/HistoryTsv";
import { Belong } from "@backend/rime/historyDb/HistoryDbRow";


const belong:Belong = Belong.commit
const ldbPath = "D:/Program Files/Rime/User_Data/_userdb/20240609170520commitHistory.ldb.txt"
const opt = historyOpt
const dbSrc = stuff.dbSrc
const historyTbl = stuff.dbSrc.getTblByName(dbSrc.names.tbl_commitHistory)
const readNRows = MkReadNRow.new(ldbPath, belong)


async function main(){
	try {
		await historyTbl.insertStrm(readNRows, {perBatch: 9999})
	} catch (err) {
		if(err instanceof DbErr){
			console.error(err.sql)
		}else if(err instanceof LineParseErr){
			console.error(err.line)
		}
		throw err
	}
}

main().catch(e=>console.error(e))
