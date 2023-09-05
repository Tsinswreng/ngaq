// import { Dict, DictRaw, DictDb } from "./Dict";
// import _ from "lodash";
// import Txt from 'Txt'
// import Ut from "Ut";
// import * as DType from './DictType'
// import {RegexReplacePair} from 'Type';

// /*
// <待做>{
// 	重碼比較 先對字取併集、使 兩表ˋ豫ˣ較之字與字數ˋ同
// 	對立速查 舉例 統計對立數 兩音素ᵗ對立度/加頻對立度
// 	篩 甲表同音但乙表否者
// 	異ᵗ方案中拼式對應關係查找
// 	音節拆分 對立互補之況ᵗ析
// 	若A音併入B音則重碼率ˋ升幾多
// 	算 每種onset 能接的p2及數量
// }
// */

// export interface IPhonology{
// 	kanjis:Kanji[]
// }

// export class Phonology{

// 	private _raw:DictRaw = new DictRaw({})

// 	;public get raw(){return this._raw;};


// 	public static 賦讀音和漢字對象數組(validBody:string[][], kanjis:Kanji[], 音arr:string[]){
// 		//console.log(validBody)//t

// 		let tr = _.zip(...validBody)
// 		//音arr = tr[1] as string[] 會改變音arr之地址?
// 		音arr.splice(0, 音arr.length, ...tr[1] as string[])
// 		//console.log(音arr)//t
// 		kanjis.length = 0
// 		kanjis = []
// 		for(let i = 0; i < tr[0].length; i++){
// 			let syllable = new ChieneseSyllable({whole:音arr[i]})
// 			let kanji = new Kanji({kanji:tr[0][i], syllable: syllable})
// 			kanjis.push(kanji)
// 		}
		
// 	}
// }

// export class Bsoc{
// 	public raw:DictRaw = new DictRaw({
// 		srcPath:'D:\\Program Files\\Rime\\User_Data\\下載\\RIME_OC_collections-main\\RIME_OC_collections-main\\OC_baxter-sagart.dict.yaml'

// 	})

// 	//public db:DictDb = new DictDb({dbPath:'./bsoc.db'})
// 	public db:DictDb = new DictDb({})

// 	public onsetMap:Map<string, number> = new Map() //出現次數
// 	public p2Map:Map<string, number> = new Map()
// 	public p3Map:Map<string, number> = new Map()

// 	public kanjis:Kanji[] = []
// 	public syllable:ChieneseSyllable[] = []


// 	public regexps:RegExp[] = []
// 	public replacePairMap:Map<RegExp, string> = new Map()
// 	public replacePair預處理:{regex:RegExp, replacement:string}[] = []
// 	public replacePair音節分割:RegexReplacePair[] = []

// 	public 音strArr:(string|undefined)[] = []
// 	public fullIpaStrArr:string[] = []
// 	public 無括號橫槓之音:string[] = []
// 	public 非三等標記 = 'ˤ'
// 	public 取讀音數組(){
// 		let tr = _.zip(...this.raw.validBody) //轉置二維數組
// 		this.音strArr = tr[1]
// 		this.fullIpaStrArr = tr[1] as string[]
// 		this.fullIpaStrArr = Bsoc.除拼音r(this.fullIpaStrArr)
// 		//this.無括號橫槓之音 = Bsoc.除中尖括號橫槓r(this.無括號橫槓之音)
// 		//console.log(this.fullIpaStrArr)
// 		this.kanjis = []
// 		for(let i = 0; i < tr[0].length; i++){
// 			let syllable = new ChieneseSyllable({whole:this.fullIpaStrArr[i]})
// 			let kanji = new Kanji({kanji:tr[0][i], syllable: syllable})
// 			this.kanjis.push(kanji)
// 		}
// 	}

// 	public 除中尖括號橫槓r(){
// 		this.音strArr = Bsoc.除中尖括號橫槓r(this.音strArr as string[])
// 	}

// 	public static 除中尖括號橫槓r(strArr:string[]/* 中=true, 尖=true *//* , 小=false */){
// 		let replacePair:RegexReplacePair[] = []
// 		replacePair.push({regex:/[\[\]]/gm, replacement:''}) //除中括號
// 		replacePair.push({regex:/[<>]/gm, replacement:''}) //除尖括號
// 		replacePair.push({regex:/-/gm, replacement:''}) //除橫槓

// 		replacePair.push({regex:/[\(\)]/gm, replacement:''}) //除小括號、姑先留小括號中ᵗ音
// 		return Ut.serialReplace(strArr as string[], replacePair)
// 	}

// 	public static 除拼音r(strArr:string[]){
// 		let replacePair:RegexReplacePair[] = []
// 		replacePair.push({regex:/^.*\*/gm, replacement:''})
// 		return Ut.serialReplace(strArr as string[], replacePair)
// 	}

// 	public 預處理(){
// 		//this.regexps.push(/^.*\*$/g)
// 		//this.replacePairMap.set(/^.*\*$/g, '')
// 		this.replacePair預處理.push({regex:/^.*\*/gm, replacement:''}) //除拼音
		
// 		//this.replacePair預處理.push({regex:/[\[\]]/gm, replacement:''}) //除中括號
// 		//this.replacePair預處理.push({regex:/[<>]/gm, replacement:''}) //除尖括號

// 		this.音strArr = Ut.serialReplace(this.音strArr as string[], this.replacePair預處理, 'gm')
// 		this.非三等標記統一置于元音前()
// 		// this.replacePair預處理.push({regex:/.*?\./gm, replacement: ''}) //除 次音節
		
// 	}

// 	public static 聲明合併r(strArr:string[]){
// 		let replacePair:RegexReplacePair[] = []
// 		replacePair.push({regex:/[mnN]p/gm, replacement:'b'}) //
// 		replacePair.push({regex:/[mnN]t/gm, replacement:'t'}) //
// 		replacePair.push({regex:/[mnN]k/gm, replacement:'k'}) //
// 		replacePair.push({regex:/[mnN]q/gm, replacement:'ɢ'}) //
// 		replacePair.push({regex:/首1.*?\.(.*?)首2/gm, replacement:'首1$1首2'}) //除 次音節
// 		replacePair.push({regex:/首1.*?ə(.*?)首2/gm, replacement:'首1$1首2'}) //除 次音節
// 		replacePair.push({regex:/C/gm, replacement:''}) //

// 		return Ut.serialReplace(strArr, replacePair)
		
// 	}

// 	public 聲明合併(){
// 		//this.音strArr = Bsoc.聲明合併r(this.音strArr as string[])
// 		for(let i = 0; i < this.kanjis.length; i++){
// 			//this.kanjis[i].syllable.onset = Bsoc.聲明合併r(this.kanjis[i].syllable.onset as string)
// 		}
// 	}

// 	public 音節分割_聲明合併(){
// 		let l = '\\(?\\[?<?'
// 		let r = '>?\\]?\\)?'
// 		//this.replacePair音節分割.push({regex:/(\(?\[?<?ʔ>?\]?\)?-?s)$/gm, replacement:'調1$1調2'})
// 		//this.replacePair音節分割.push({regex:/(ʔ-?s)$/gm, replacement:'調1$1調2'})
// 		this.replacePair音節分割.push({regex:new RegExp(`(${l}ʔ${r}-?s)$`, 'gm'), replacement:'調1$1調2'})
// 		this.replacePair音節分割.push({regex:/(\-?s)$/gm, replacement:'調1$1調2'})
// 		//this.replacePair音節分割.push({regex:/(\(?\[?<?ʔ>?\]?\)?)$/gm, replacement:'調1$1調2'})
// 		this.replacePair音節分割.push({regex:new RegExp(`(${l}ʔ${r})$`, 'gm'), replacement:'調1$1調2'})
// //${l}${r}
// 		//this.replacePair音節分割.push({regex:/(\(?\[?<?([mnŋptkjwr]|w\(?\[?<?k>?\]?\)?)>?\]?\)?)調1/gm, replacement:'尾1$1尾2調1'})
// 		this.replacePair音節分割.push({regex:new RegExp(`(${l}[mnŋptkjwr]${r}|${l}w${r}${l}k${r})調1`, 'gm'), replacement:'尾1$1尾2調1'})
// 		//this.replacePair音節分割.push({regex:/(\(?\[?<?([mnŋptkjwr]|w\(?\[?<?k>?\]?\)?)>?\]?\)?)$/gm, replacement:'尾1$1尾2調1調2'}) //處理鼻音平聲和入聲
// 		this.replacePair音節分割.push({regex:new RegExp(`(${l}[mnŋptkjwr]${r}|${l}w${r}${l}k${r})$`, 'gm'), replacement:'尾1$1尾2調1調2'}) //處理鼻音平聲和入聲

// 		this.replacePair音節分割.push({regex:/(\(?\[?<?[Aaeiouə]>?\]?\)?)調1/gm, replacement:'$1尾1尾2調1'}) //處理開韻尾上去聲
// 		this.replacePair音節分割.push({regex:/(\(?\[?<?[Aaeiouə]>?\]?\)?)$/gm, replacement:'$1尾1尾2調1調2'}) //處理開韻尾平聲

// 		this.replacePair音節分割.push({regex:/(\(?\[?<?ˤ?[Aaeiouə]>?\]?\)?)尾1/gm, replacement:'腹1$1腹2尾1'}) 
// 		this.replacePair音節分割.push({regex:/(\(?\[?<?r>?\]?\)?)腹1/gm, replacement:'介1$1介2腹1'})
// 		this.replacePair音節分割.push({regex:/^((?!.*介).*)腹1/gm, replacement:'$1介1介2腹1'})
// 		//this.replacePair音節分割.push({regex:/^(.*?\.)/gm, replacement:'次$1次'})
// 		this.replacePair音節分割.push({regex:/^(.*?)介1/gm, replacement:'首1$1首2介1'})
// 		this.音strArr = Ut.serialReplace(this.音strArr as string[], this.replacePair音節分割, 'gm')

// 		this.音strArr = Bsoc.聲明合併r(this.音strArr as string[])

// 		//this.syllable = []
// 		for(let i = 0; i < this.音strArr.length; i++){
// 			let sy = 首介腹尾調_分割(this.音strArr[i]!)
// 			//this.syllable.push(sy)
// 			this.kanjis[i].syllable = Object.assign(this.kanjis[i].syllable, sy)
// 		}
// 		if(this.kanjis.length != this.音strArr.length){throw new Error('this.syllable.length != this.音strArr.length')}

// 		function 首介腹尾調_分割(str:string){
// 			const regex = /首1(.*?)首2(.*?)介1(.*?)介2(.*?)腹1(.*?)腹2(.*?)尾1(.*?)尾2(.*?)調1(.*?)調2/;
// 			const match = str.match(regex);
// 			let result = new ChieneseSyllable()
// 			if (match) {
// 				const [, first, second, intro1, intro2, belly1, belly2, tail1, tail2, tone1, tone2] = match; 
// //解构赋值、first對應match[1]
// 				// console.log("首1 to 首2:", first);
// 				// console.log("介1 to 介2:", intro1);
// 				// console.log("腹1 to 腹2:", belly1);
// 				// console.log("尾1 to 尾2:", tail1);
// 				// console.log("調1ʔ to 調2:", tone1);
				
// 				result.onset = Ut.nng(first)
// 				result.medial = Ut.nng(intro1)
// 				result.vowel = Ut.nng(belly1)
// 				result.coda = Ut.nng(tail1)
// 				result.tone = Ut.nng(tone1)

// 				// result.p2 = Util.nonNullableGet(intro1+belly1)
// 				// result.p3 = Util.nonNullableGet(tail1+tone1)
// 			}
// 			return result
// 		}
// 	}

// 	public 檢查音節分割是否正確(){

// 		for(let i = 0; i < this.音strArr.length; i++){
// 			//console.log(this.音strArr[i])
// 			console.log(this.kanjis[i])
// 		}
// 	}

// 	public 非三等標記統一置于元音前(){

// 		//f('('+this.非三等標記+')', this.音strArr as string[]) 
// 		//「捉抓」的咽化有括號 未處理
// 		f(this.非三等標記, this.音strArr as string[])
// 		function f(非三等標記:string, 音strArr:string[]){
// 			let r = new RegExp(非三等標記)
// 			let proper = new RegExp(非三等標記+'[aeiouə]')
// 			let replacePair:RegexReplacePair[] = []
// 			replacePair.push({regex:new RegExp(非三等標記,'g'), replacement:''}) //刪 原ᵗ非三等標記
	
// 			replacePair.push({regex:/a/g, replacement:非三等標記+'a'})
// 			replacePair.push({regex:/e/g, replacement:非三等標記+'e'})
// 			replacePair.push({regex:/i/g, replacement:非三等標記+'i'})
// 			replacePair.push({regex:/o/g, replacement:非三等標記+'o'})
// 			replacePair.push({regex:/u/g, replacement:非三等標記+'u'})
// 			replacePair.push({regex:/ə/g, replacement:非三等標記+'ə'})
// 			for(let i = 0; i < 音strArr.length; i++){
// 				if(r.test(音strArr[i]!)){
// 					if(proper.test(音strArr[i]!)){continue}
// 					else{音strArr[i] = Ut.serialReplace(音strArr[i]!, replacePair)}
// 				}
// 			}
// 		}
// 	}

// 	public 統計出現次數(){
// 		let onset:string[] = []
// 		let p2:string[] = []
// 		let p3:string[] = []
// 		for(let i = 0; i < this.kanjis.length; i++){
// 			try{
// 				onset.push(Ut.nng(this.kanjis[i].syllable.onset))
// 				// if(this.kanjis[i].syllable.onset! === ''){
// 				// 	console.log(this.kanjis[i])
// 				// } //來母分割得的onset是空字串
// 				p2.push(Ut.nng(this.kanjis[i].syllable.p2))
// 				p3.push(Ut.nng(this.kanjis[i].syllable.p3))
// 			}catch(e){
// 				console.error(this.kanjis[i])
// 				console.error(e)
// 			}

// 		}
// 		this.onsetMap = Ut.mapOccurrenceTimes(onset)
// 		this.p2Map = Ut.mapOccurrenceTimes(p2)
// 		this.p3Map = Ut.mapOccurrenceTimes(p3)
// 	}

// 	public async creatTable(){
// 		//await this.db.creatTable()
// 		//let altSql = `ALTER TABLE ADD COLUMN onset VARCHAR(64)`
// 		let tableName = 'bsoc'
// 		let creatSql:string = `CREATE TABLE [${tableName}] ( `+
// 			`${DType.cn.id} INTEGER PRIMARY KEY AUTOINCREMENT,` +
// 			`${DType.cn.char} VARCHAR(1024), ` + //字
// 			`${DType.cn.code} VARCHAR(64), ` + //完整ipa
// 			`${DType.cn.ratio} VARCHAR(64), `+ //暫時沒用
// 			//以下皆不帶中括號與尖括號
// 			`onset VARCHAR(64), `+ 
// 			`medial VARCHAR(64), `+
// 			`vowel VARCHAR(64), ` +
// 			`coda VARCHAR(64), ` +
// 			`tone VARCHAR(64) ` +
// 			`)`
// 		return DictDb.all(this.db.db, creatSql)
		
// 	}

// 	public async insertIntoDb(kanjis:Kanji[]){
// 		return new Promise((s,j)=>{
// 			this.db.db.serialize(()=>{
// 				this.db.db.run('BEGIN TRANSACTION;')
// 				let sql = `INSERT INTO bsoc (${DType.cn.char}, ${DType.cn.code}, onset, medial, vowel, coda, tone) `+
// 				`VALUES (?,?,?,?,?,?,?)`
// 				const stmt = this.db.db.prepare(sql)
// 				for(let i = 0; i < kanjis.length; i++){
// 					try{
// 						let v:string[] = 
// 						[Ut.nng(kanjis[i].kanji),
// 						Ut.nng(kanjis[i].syllable.whole),
// 						Ut.nng(kanjis[i].syllable.onset),
// 						Ut.nng(kanjis[i].syllable.medial),
// 						Ut.nng(kanjis[i].syllable.vowel),
// 						Ut.nng(kanjis[i].syllable.coda),
// 						Ut.nng(kanjis[i].syllable.tone),]
// 						stmt.run(v)
// 					}catch(e){
// 						//console.error(e)
// 						console.error('i= '+i)
// 						console.error(kanjis[i])
// 					}
					

// 				}
// 				this.db.db.run('COMMIT;', (err)=>{
// 					if(err){j(err);return}
// 					s(0)
// 				})
// 			})
// 		})
// 	}

// 	public static async run(){
// 		let bsoc = new Bsoc()
// 		bsoc.取讀音數組()
// 		bsoc.除中尖括號橫槓r()
// 		bsoc.預處理()
// 		bsoc.聲明合併()
// 		bsoc.音節分割_聲明合併()
// 		bsoc.統計出現次數()
// 		//console.log(bsoc.音)
// 		//bsoc.檢查音節分割是否正確()
// 		//bsoc.kanjis.forEach((e)=>{console.log(e)})
// 		console.log(Ut.sortMapIntoObj(bsoc.onsetMap))
// 		console.log(Ut.sortMapIntoObj(bsoc.p2Map))
// 		console.log(Ut.sortMapIntoObj(bsoc.p3Map))

// 		console.log(Ut.sortMapIntoObj(bsoc.onsetMap).length)
// 		console.log(Ut.sortMapIntoObj(bsoc.p2Map).length)
// 		console.log(Ut.sortMapIntoObj(bsoc.p3Map).length)
// 		//await bsoc.creatTable()
// 		//await bsoc.insertIntoDb(bsoc.kanjis)
// 	}
// }

// export class Kanji{
// 	public kanji?:string
// 	public syllable = new ChieneseSyllable()
// 	constructor(props?:Partial<Kanji>) {
// 		if(props){Object.assign(this, props)}
// 	}
// }

// export class ChieneseSyllable{
// 	public whole?:string
// 	public onset?:string
// 	public medial?:string
// 	public vowel?:string
// 	public coda?:string
// 	public tone?:string
// 	//public p2?:string //r+主元音
// 	//public p3?:string //韻尾+聲調
// 	public get p2():string|undefined{
// 		return this.medial! + this.vowel!
// 	}
// 	public get p3():string|undefined{
// 		return this.coda! + this.tone!
// 	}
// 	constructor(props?:Partial<ChieneseSyllable>) {
// 		if(props){Object.assign(this, props)}
// 	}
// }

// export class OcOnset{
// 	public whole?:string
// }

// export class OcP2{
// 	public whole?:string
// }

// export class BsocP3{
// 	public whole?:string
// }





// //以下暫時不用

// export class OcMedial{

// }

// export class OcVowel{
	
// }

// export class OcCoda{

// }

// export class OcTone{

// }





// export class Msoc{
	
	
// 	raw:DictRaw = new DictRaw({
// 		srcPath:'D:\\Program Files\\Rime\\User_Data\\下載\\RIME_OC_collections-main\\RIME_OC_collections-main\\OC_msoeg.dict.yaml'
// 	})
// 	kanjis:Kanji[] = []
// 	pronounceArr:string[] = []

// 	public assign(){
// 		Phonology.賦讀音和漢字對象數組(this.raw.validBody, this.kanjis, this.pronounceArr)
// 		//console.log(this.pronounceArr)//t
// 	}

// 	public 豫處理(){
// 		let replacePair:RegexReplacePair[] = 
// 		[
// 			//{regex:/â/gm, replacement:'ˤa'},
// 			// {regex:/^(.*)\*/gm, replacement:''},
// 			// {regex:/(.)̂/gm, replacement:'ˤ$1'},
// 			// {regex:/h$/gm, replacement:'s'},
// 			// {regex:/ja$/gm, replacement:'A'},
// 			//{regex:/([ʔs])$/gm, replacement:'調1$1調2'},
// 			//{regex:/^(.*)([jaeiouəˤr])/gm, replacement:'$1 $2'},
			
// 			//{regex:/^(.*?)(rˤ[Aaeiouə])(.*?)/gm, replacement:'$1韻$2韻$3'},
// 			//{regex:/^(.*?)(ˤ[Aaeiouə])(.*?)/gm, replacement:'$1韻$2韻$3'},
// 			//{regex:/^(.*?)([rˤ][Aaeiouə])(.*?)/gm, replacement:'$1韻$2韻$3'},
// 			//{regex:/^([^ ]*)(rˤ[Aaeiouə])/gm, replacement:'$1\t$2'},
// 			//{regex:/^(.*)([ˤ])/gm, replacement:'$1 $2'},
// 			{regex:/（.*?）/gm, replacement:''}, 
// 			{regex:/^(.*)\*/gm, replacement:''},
// 			{regex:/[\[\]]/gm, replacement:''},
// 			{regex:/ɛ/gm, replacement:'e'},
// 			{regex:/ɔ/gm, replacement:'o'},
// 			{regex:/ʴ/gm, replacement:'r'},

// 		]

// 		this.pronounceArr = Ut.serialReplace(this.pronounceArr, replacePair)
// 	}

// 	public static run(){
// 		let schloc = new Msoc()
// 		schloc.assign()
// 		schloc.豫處理()
// 		console.log(schloc.pronounceArr)
// 		let bsoc = new Bsoc()
// 		//DictDb.putNewTable(bsoc.db.db, )
// 	}

// }

// //Bsoc.run()
// //Schloc.run()
// //Msoc.run()