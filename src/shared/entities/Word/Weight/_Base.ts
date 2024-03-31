import { I_WordWeight } from "@shared/interfaces/I_WordWeight"
import { MemorizeWord } from "../MemorizeWord"
import { weightLib as L } from "./_lib"

const sros = L.Sros.Sros.new()
const s = sros.short
const Tempus_Event = L.Word.Tempus_Event
type Tempus_Event = InstanceType<typeof Tempus_Event>
const WordEvent = L.Word.WordEvent
type WordEvent = typeof WordEvent

class Record{
	protected constructor(){

	}
	static new(){}
}

class _DefaultOpt{
	addWeight = 0xF
	debuffNumerator = 1000*3600*24*90
	base = 20
}

export class WordWeight implements I_WordWeight{

	protected constructor(){

	}

	static new(prop?:{}){
		const o = new this()
		return o
	}

	readonly This = WordWeight

	run(mWords:MemorizeWord[]) {
		
	}

	calc0(mWord:MemorizeWord){
		const z = this
		const nunc = L.Tempus.new()
		let cnt_add = 0
		let cnt_rmb = 0
		let validRmbCnt = 0 //憶ᵗ次、若遇加ˡ事件則置零
		//let finalAddEventOrder = z.This.finalAddEventPos()

		function handle_add(){
			
		}
	}


	/**
	 * 尋ᵣ末個 加ˡ事件
	 * @param tempus__event 
	 * @returns 
	 */
	static finalAddEventPos(tempus__event:Tempus_Event[]){
		let ans = 0
		for(let i = tempus__event.length-1; i>=0; i--){
			if(tempus__event[i].event === WordEvent.ADD){
				ans = i;
				break
			}
		}
		return ans
	}



}

/* 

_metadata表增一字段、id潙0、以存總ᵗ默認ᵗ權重算法。
其創ʴᵗ時即建元數據表之時。

表ʸ存ᵗ權重算法代碼ˋ用json
從數數據表中取出特定表ᵗ權重算法類
支持導入他ᵗ表ᵗ權重算法類、然後改參數。

*/