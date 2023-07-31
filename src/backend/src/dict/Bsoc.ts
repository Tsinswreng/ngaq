import { Dict, DictRaw } from "./Dict";
import _ from "lodash";
/*
<待做>{
	重碼比較 先對字取併集
	對立速查
	篩 甲表同音但乙表否者
	異ᵗ方案中拼式對應關係查找
	音節拆分 對立互補之況ᵗ析
}
*/
class Bsoc{
	public raw:DictRaw = new DictRaw({
		srcPath:'D:\\Program Files\\Rime\\User_Data\\下載\\RIME_OC_collections-main\\RIME_OC_collections-main\\OC_baxter-sagart.dict.yaml'

	})

	public regexps:RegExp[] = []
	public replacePairMap:Map<RegExp, string> = new Map()
	public replacePair:{regex:RegExp, replacement:string}[] = []

	public 音:(string|undefined)[] = []

	public 取讀音數組(){
		let tr = _.zip(...this.raw.validBody)
		this.音 = tr[1]
	}

	public 預處理(){
		//this.regexps.push(/^.*\*$/g)
		//this.replacePairMap.set(/^.*\*$/g, '')
		this.replacePair.push({regex:/^.*\*/g, replacement:''}) //除拼音
		this.replacePair.push({regex:/.*?\./g, replacement: ''}) //除 次音節
		this.replacePair.push({regex:/-/g, replacement:''}) //除橫槓
		this.replacePair.push({regex:/[\[\]]/g, replacement:''}) //除中括號
		this.replacePair.push({regex:/[<>]/g, replacement:''}) //除尖括號
	}

	public static async run(){
		let bsoc = new Bsoc()
		bsoc.取讀音數組()
	}
}

Bsoc.run()