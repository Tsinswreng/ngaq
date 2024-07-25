import { NgaqLex } from "@shared/Lex/ngaqLex/NgaqLex"
import { Client } from "./Client"
import { JoinedWord } from '@shared/model/word/JoinedWord'
import { JoinedRow } from '@shared/model/word/JoinedRow'
export class AddWordsSvc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof AddWordsSvc.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	protected _client = Client.inst
	get client(){return this._client}
	protected set client(v){this._client = v}
	

	parse(text:str){
		const lex = NgaqLex.new(text)
		const map = lex.read_tempus__wordBlocks()
		const jWords = [] as JoinedWord[]
		for(const [tempus, words] of map){
			for(const w of words){
				const ua = JoinedWord.new({
					textWord: w.textWord
					,propertys: w.propertys
					,learns: []
				})
				jWords.push(ua)
			}
		}
		return jWords.map(e=>e.toRow())
	}

	async AddJoinedRows(joinedRows:JoinedRow[]){
		const z = this
		return await z.client.AddNeoWords(joinedRows)
	}

	//get This(){return AddWordsSvc}


}
