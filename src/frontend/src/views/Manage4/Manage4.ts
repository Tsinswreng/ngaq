import {Client} from "@ts/ngaq4/Client"
import {JoinedWord} from "@shared/model/word/JoinedWord"
import { classify } from "@shared/algo"
import * as NRow from "@shared/model/word/NgaqRows"
import * as NMod from "@shared/model/word/NgaqModels"
/** temp */
export class Manage4 {
	static inst = new Manage4()
	static getInst(){
		return this.inst
	}

	client = Client.getInst()

	joinedWords: JoinedWord[] = []
	text__joinedWords: Map<string, JoinedWord[]> = new Map()
	constructor(){
		const z = this
		z.init()
	}

	init(){
		const z = this
		z.client.GetWordsFromAllTables().then(words=>{
			z.joinedWords = words.map(e=>JoinedWord.fromRow(e))
			z.text__joinedWords = classify(z.joinedWords, (e)=>e.textWord.text)
		})
	}

	reload(){
		const z = this
		z.init()
	}

	async SeekWordByText(text: string){
		const word = this.text__joinedWords.get(text)
		return word
	}

	async Rm_Word(id:str|int){
		const z = this
		return z.client.Rm_wordById(id)
	}

	async Upd_prop(prop: NMod.Property){
		const z = this
		const row = prop.toRow()
		return await z.client.Upd_prop(row)
	}
}