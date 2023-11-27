import SingleWord2 from "@shared/SingleWord2"
import { $a } from "@shared/Ut"
import VocaRaw2 from "@shared/VocaRaw2"
import { alertEtThrow } from "@ts/frut"
import VocaClient from "@ts/voca/VocaClient"
const vocaClient = VocaClient.getInstance()
export default class Manage{

	public static readonly id_wordSrcStr = 'wordSrcStr'
	public static readonly id_neoTableName = 'neoTableName'
	public static readonly id_sqlInsert = 'sqlInsert'
	public static readonly id_dbPath = 'dbPath'
	public static readonly id_wordPriorityAlgorithm = `wordPriorityAlgorithm`
	public static readonly id_inputBaseUrl = 'inputBaseUrl'

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
		try{
			let srcText = this.getSrcStr()
			const raw = new VocaRaw2(srcText)
			let words = raw.parseWords()
			let rows = SingleWord2.fieldStringfy(words)
			VocaClient.addWords(rows, raw.config)
		}catch(e){
			alertEtThrow(e)
		}
		
	}

	public backupAllTables(){
		alertEtThrow(`已棄用`)
		//return VocaClient.backupAllTables()
	}

	public creatTable(){
		
		try {
			const input = document.getElementById(Manage.id_neoTableName) as HTMLTextAreaElement
			const neoTableName = input.value
			if(!neoTableName){console.error(`!neoTableName`)}
			return VocaClient.creatTable($a(neoTableName))
		} catch (e) {
			alertEtThrow(e)
		}
	}

	public testWriteLocalStorage(){
		const input = document.getElementById(Manage.id_dbPath) as HTMLTextAreaElement
		const path = input.value
		localStorage.setItem('dbPath',path)
	}

	public testReadLocalStorage(){
		console.log(localStorage.getItem('dbPath'))
	}

	public get_wordPriorityAlgorithm(){
		const input = document.getElementById(Manage.id_wordPriorityAlgorithm) as HTMLTextAreaElement
		return input.value
	}

	public async getCompiledJs(){
		const tsCode = this.get_wordPriorityAlgorithm()
		const jsCode = await VocaClient.compileTs(tsCode)
		console.log(jsCode)//t
		return jsCode
	}

	public get_inputBaseUrl(){
		const input = document.getElementById(Manage.id_inputBaseUrl) as HTMLInputElement
		return input.value
	}

	public set_baseUrl(){
		const neo = this.get_inputBaseUrl()
		if(neo?.length>0){
			VocaClient.set_baseUrl(neo)
		}
	}

	

}