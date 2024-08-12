import { MkReadNRow } from "@backend/rime/old_historyDb/ReadFromTxt";
import { historyOpt } from "./old_opt";
import { stuff } from "./old_stuff";
import { DbErr } from "@backend/sqlite/Sqlite";
import { LineParseErr } from "@backend/rime/old_historyDb/HistoryTsv";
import { Belong } from "@backend/rime/old_historyDb/old_HistoryDbRow";

const opt = historyOpt
const dbSrc = stuff.dbSrc
const historyTbl = stuff.dbSrc.getTblByName(dbSrc.names.tbl_commitHistory)
function test1(){
	const belong:Belong = Belong.commit
	const ldbPath = "D:/Program Files/Rime/User_Data/_userdb/20240609170520commitHistory.ldb.txt"
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
}

function test2(){
// $ldb,o|"D:/Program Files/Rime/User_Data/_userdb/test/userPredictRecord.ldb"|./userPredictRecord.txt
// 
	const belong:Belong = Belong.coinage
	const ldbPath = "D:/Program Files/Rime/User_Data/_userdb/20240609170520commitHistory.ldb.txt"
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
}
