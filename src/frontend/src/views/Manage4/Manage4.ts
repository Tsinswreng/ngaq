import {Client} from "@ts/ngaq4/Client"
import {JoinedWord} from "@shared/model/word/JoinedWord"
import { classify } from "@shared/algo"
/** temp */
export class Manage4 {
	static inst = new Manage4()
	static getInst(){
		return this.inst
	}

	joinedWords: JoinedWord[] = []
	text__joinedWords: Map<string, JoinedWord[]> = new Map()
	constructor(){
		const z = this
		Client.inst.GetWordsFromAllTables().then(words=>{
			z.joinedWords = words.map(e=>JoinedWord.fromRow(e))
			z.text__joinedWords = classify(z.joinedWords, (e)=>e.textWord.text)
		})
	}

	async SeekWordByText(text: string){
		const word = this.text__joinedWords.get(text)
		
		return word
	}
}