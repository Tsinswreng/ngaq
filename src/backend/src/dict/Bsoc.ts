import { Dict, DictRaw } from "./Dict";
import _ from "lodash";
import {SerialRegExp, RegexReplacePair} from 'SerialRegExp'
import Txt from 'Txt'
import Util from "Util";

/*
<待做>{
	重碼比較 先對字取併集、使 兩表ˋ豫ˣ較之字與字數ˋ同
	對立速查 舉例 統計對立數
	篩 甲表同音但乙表否者
	異ᵗ方案中拼式對應關係查找
	音節拆分 對立互補之況ᵗ析
}
*/
export class Bsoc{
	public raw:DictRaw = new DictRaw({
		srcPath:'D:\\Program Files\\Rime\\User_Data\\下載\\RIME_OC_collections-main\\RIME_OC_collections-main\\OC_baxter-sagart.dict.yaml'

	})

	public onsetMap:Map<string, number> = new Map() //出現次數
	public p2Map:Map<string, number> = new Map()
	public p3Map:Map<string, number> = new Map()

	public kanjis:Kanji[] = []
	public syllable:BsocSyllable[] = []


	public regexps:RegExp[] = []
	public replacePairMap:Map<RegExp, string> = new Map()
	public replacePair預處理:{regex:RegExp, replacement:string}[] = []
	public replacePair音節分割:RegexReplacePair[] = []

	public 音strArr:(string|undefined)[] = []
	public 非三等標記 = 'ˤ'
	public 取讀音數組(){
		let tr = _.zip(...this.raw.validBody)
		this.音strArr = tr[1]
		this.kanjis = []
		for(let i = 0; i < tr[0].length; i++){
			let syllable = new BsocSyllable({whole:tr[1][i]})
			let kanji = new Kanji({kanji:tr[0][i], syllable: syllable})
			this.kanjis.push(kanji)
		}
	}

	public 預處理(){
		//this.regexps.push(/^.*\*$/g)
		//this.replacePairMap.set(/^.*\*$/g, '')
		this.replacePair預處理.push({regex:/^.*\*/gm, replacement:''}) //除拼音
		
		this.replacePair預處理.push({regex:/[\[\]]/gm, replacement:''}) //除中括號
		this.replacePair預處理.push({regex:/[<>]/gm, replacement:''}) //除尖括號

		this.音strArr = SerialRegExp.serialReplace(this.音strArr as string[], this.replacePair預處理, 'gm')
		this.非三等標記統一置于元音前()
		// this.replacePair預處理.push({regex:/.*?\./gm, replacement: ''}) //除 次音節
		// this.replacePair預處理.push({regex:/-/gm, replacement:''}) //除橫槓

		// this.replacePair預處理.push({regex:/[\(\)]/gm, replacement:''}) //除小括號、姑先留小括號中ᵗ音

		
		
	}

	public 音節分割(){
		let l = '\\(?\\[?<?'
		let r = '>?\\]?\\)?'
		//this.replacePair音節分割.push({regex:/(\(?\[?<?ʔ>?\]?\)?-?s)$/gm, replacement:'調1$1調2'})
		//this.replacePair音節分割.push({regex:/(ʔ-?s)$/gm, replacement:'調1$1調2'})
		this.replacePair音節分割.push({regex:new RegExp(`(${l}ʔ${r}-?s)$`, 'gm'), replacement:'調1$1調2'})
		this.replacePair音節分割.push({regex:/(\-?s)$/gm, replacement:'調1$1調2'})
		//this.replacePair音節分割.push({regex:/(\(?\[?<?ʔ>?\]?\)?)$/gm, replacement:'調1$1調2'})
		this.replacePair音節分割.push({regex:new RegExp(`(${l}ʔ${r})$`, 'gm'), replacement:'調1$1調2'})
//${l}${r}
		//this.replacePair音節分割.push({regex:/(\(?\[?<?([mnŋptkjwr]|w\(?\[?<?k>?\]?\)?)>?\]?\)?)調1/gm, replacement:'尾1$1尾2調1'})
		this.replacePair音節分割.push({regex:new RegExp(`(${l}[mnŋptkjwr]${r}|${l}w${r}${l}k${r})調1`, 'gm'), replacement:'尾1$1尾2調1'})
		//this.replacePair音節分割.push({regex:/(\(?\[?<?([mnŋptkjwr]|w\(?\[?<?k>?\]?\)?)>?\]?\)?)$/gm, replacement:'尾1$1尾2調1調2'}) //處理鼻音平聲和入聲
		this.replacePair音節分割.push({regex:new RegExp(`(${l}[mnŋptkjwr]${r}|${l}w${r}${l}k${r})$`, 'gm'), replacement:'尾1$1尾2調1調2'}) //處理鼻音平聲和入聲

		this.replacePair音節分割.push({regex:/(\(?\[?<?[Aaeiouə]>?\]?\)?)調1/gm, replacement:'$1尾1尾2調1'}) //處理開韻尾上去聲
		this.replacePair音節分割.push({regex:/(\(?\[?<?[Aaeiouə]>?\]?\)?)$/gm, replacement:'$1尾1尾2調1調2'}) //處理開韻尾平聲

		this.replacePair音節分割.push({regex:/(\(?\[?<?ˤ?[Aaeiouə]>?\]?\)?)尾1/gm, replacement:'腹1$1腹2尾1'}) 
		this.replacePair音節分割.push({regex:/(\(?\[?<?r>?\]?\)?)腹1/gm, replacement:'介1$1介2腹1'})
		this.replacePair音節分割.push({regex:/^((?!.*介).*)腹1/gm, replacement:'$1介1介2腹1'})
		//this.replacePair音節分割.push({regex:/^(.*?\.)/gm, replacement:'次$1次'})
		this.replacePair音節分割.push({regex:/^(.*?)介1/gm, replacement:'首1$1首2介1'})
		this.音strArr = SerialRegExp.serialReplace(this.音strArr as string[], this.replacePair音節分割, 'gm')

		//this.syllable = []
		for(let i = 0; i < this.音strArr.length; i++){
			let sy = 首介腹尾調_分割(this.音strArr[i]!)
			//this.syllable.push(sy)
			this.kanjis[i].syllable = sy
		}
		if(this.kanjis.length != this.音strArr.length){throw new Error('this.syllable.length != this.音strArr.length')}

		function 首介腹尾調_分割(str:string){
			const regex = /首1(.*?)首2(.*?)介1(.*?)介2(.*?)腹1(.*?)腹2(.*?)尾1(.*?)尾2(.*?)調1(.*?)調2/;
			const match = str.match(regex);
			let result = new BsocSyllable()
			if (match) {
				const [, first, second, intro1, intro2, belly1, belly2, tail1, tail2, tone1, tone2] = match; 
//解构赋值、first對應match[1]
				// console.log("首1 to 首2:", first);
				// console.log("介1 to 介2:", intro1);
				// console.log("腹1 to 腹2:", belly1);
				// console.log("尾1 to 尾2:", tail1);
				// console.log("調1ʔ to 調2:", tone1);
				
				result.onset = Util.nonNullableGet(first)
				result.p2 = Util.nonNullableGet(intro1+belly1)
				result.p3 = Util.nonNullableGet(tail1+tone1)
			}
			return result
		}
	}

	public 檢查音節分割是否正確(){

		for(let i = 0; i < this.音strArr.length; i++){
			//console.log(this.音strArr[i])
			console.log(this.kanjis[i])
		}
	}

	public 非三等標記統一置于元音前(){

		//f('('+this.非三等標記+')', this.音strArr as string[]) 
		//「捉抓」的咽化有括號 未處理
		f(this.非三等標記, this.音strArr as string[])
		function f(非三等標記:string, 音strArr:string[]){
			let r = new RegExp(非三等標記)
			let proper = new RegExp(非三等標記+'[aeiouə]')
			let replacePair:RegexReplacePair[] = []
			replacePair.push({regex:new RegExp(非三等標記,'g'), replacement:''}) //刪 原ᵗ非三等標記
	
			replacePair.push({regex:/a/g, replacement:非三等標記+'a'})
			replacePair.push({regex:/e/g, replacement:非三等標記+'e'})
			replacePair.push({regex:/i/g, replacement:非三等標記+'i'})
			replacePair.push({regex:/o/g, replacement:非三等標記+'o'})
			replacePair.push({regex:/u/g, replacement:非三等標記+'u'})
			replacePair.push({regex:/ə/g, replacement:非三等標記+'ə'})
			for(let i = 0; i < 音strArr.length; i++){
				if(r.test(音strArr[i]!)){
					if(proper.test(音strArr[i]!)){continue}
					else{音strArr[i] = SerialRegExp.serialReplace(音strArr[i]!, replacePair, 'g')}
				}
			}
		}
	}

	public 統計出現次數(){
		let onset:string[] = []
		let p2:string[] = []
		let p3:string[] = []
		for(let i = 0; i < this.kanjis.length; i++){
			try{
				onset.push(Util.nonNullableGet(this.kanjis[i].syllable.onset))
				// if(this.kanjis[i].syllable.onset! === ''){
				// 	console.log(this.kanjis[i])
				// } //來母分割得的onset是空字串
				p2.push(Util.nonNullableGet(this.kanjis[i].syllable.p2))
				p3.push(Util.nonNullableGet(this.kanjis[i].syllable.p3))
			}catch(e){
				console.error(this.kanjis[i])
				console.error(e)
			}

		}
		this.onsetMap = Util.mapOccurrenceTimes(onset)
		this.p2Map = Util.mapOccurrenceTimes(p2)
		this.p3Map = Util.mapOccurrenceTimes(p3)
	}

	public static async run(){
		let bsoc = new Bsoc()
		bsoc.取讀音數組()
		bsoc.預處理()
		bsoc.音節分割()
		bsoc.統計出現次數()
		//console.log(bsoc.音)
		//bsoc.檢查音節分割是否正確()
		bsoc.kanjis.forEach((e)=>{
			console.log(e)
			//if(e.syllable.p3==='k]'){console.log(e)}
		})
		console.log(Util.sortMapIntoObj(bsoc.onsetMap))
		console.log(Util.sortMapIntoObj(bsoc.p2Map))
		console.log(Util.sortMapIntoObj(bsoc.p3Map))
	}
}

export class Kanji{
	public kanji?:string
	public syllable = new BsocSyllable()
	constructor(props?:Partial<Kanji>) {
		if(props){Object.assign(this, props)}
	}
}

export class BsocSyllable{
	public whole?:string
	public onset?:string
	public p2?:string
	public p3?:string
	constructor(props?:Partial<BsocSyllable>) {
		if(props){Object.assign(this, props)}
	}
}

export class BsocOnset{
	public whole?:string
}

export class BsocP2{
	public whole?:string
}

export class BsocP3{
	public whole?:string
}



Bsoc.run()

//以下暫時不用

export class BsocMedial{

}

export class BsocVowel{
	
}

export class BsocCoda{

}

export class BsocTone{

}