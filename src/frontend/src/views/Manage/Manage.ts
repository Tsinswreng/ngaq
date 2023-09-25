import SingleWord2 from "@shared/SingleWord2"
import { $a } from "@shared/Ut"
import VocaRaw2 from "@shared/VocaRaw2"
import VocaClient from "@ts/voca/VocaClient"
const vocaClient = VocaClient.getInstance()
export default class Manage{

	public static readonly id_wordSrcStr = 'wordSrcStr'
	public static readonly id_neoTableName = 'neoTableName'
	public static readonly id_sqlInsert = 'sqlInsert'

	private static _instance: Manage
	private constructor(){}

	public static getInstance(){
		if(this._instance === void 0){
			this._instance = new Manage()
		}
		return this._instance
	}


	private getSrcStr(){
		const textarea = document.getElementById(Manage.id_wordSrcStr) as HTMLTextAreaElement
		const text = textarea.value
		return text
	}

	public addInDb(){
		let srcText = this.getSrcStr()
		const raw = new VocaRaw2(srcText)
		let words = raw.parseWords()
		let rows = SingleWord2.fieldStringfy(words)
		VocaClient.addWords(rows, raw.config)
	}

	public backupAllTables(){
		return VocaClient.backupAllTables()
	}

	public creatTable(){
		const input = document.getElementById(Manage.id_neoTableName) as HTMLTextAreaElement
		const neoTableName = input.value
		if(!neoTableName){console.error(`!neoTableName`)}
		return VocaClient.creatTable($a(neoTableName))
	}

}