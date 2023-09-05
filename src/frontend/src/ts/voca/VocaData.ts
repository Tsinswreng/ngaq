import { IVocaRow } from "@shared/SingleWord2"

export default class VocaData{
	public static async fetchWords(){
		try{
			const res = await fetch('http://127.0.0.1:1919/english')
			//console.log(res)
			if(!res.ok){
				throw new Error(`!res.ok`)
			}
			const words:IVocaRow[] = await res.json()
			return words
		}catch(e){
			console.error(e)
		}
	}
}