import { $, RegexReplacePair, printArr } from "@shared/Ut";
import Txt from "@shared/Txt";
import * as fs from 'fs'
import {pathAt} from '@shared/Ut'

const 聲符str = fs.readFileSync(('./聲符.txt'), 'utf-8')
const 義符str = fs.readFileSync(('./義符.txt'), 'utf-8')


function str轉RegexReplacePair(str:string){
	const strArr = Txt.getTableFromStr(str)
	const regexReplacePair:RegexReplacePair[] = []
	for(const e of strArr){
		const r:RegexReplacePair = {regex:new RegExp(e[0], 'gm'), replacement: e[1]??''}
		regexReplacePair.push(r)
	}
	return regexReplacePair
}

const 義符RegexReplacePair = str轉RegexReplacePair(義符str)
const 聲符RegexReplacePair = str轉RegexReplacePair(聲符str)

let expt = 聲符RegexReplacePair
expt.push(...義符RegexReplacePair);


for(const e of expt){
	console.log(e)
}
export default expt

/*



聲符同韻者: 
oŋ	容夆
ˁal	單那
ˁaj	皮(aj) 我 可
ew	堯票
aŋ	方亡昜



*/

/*


娥	 用al?
俄	
莪	
蛾	







平
坪
評
苹



堯	堯
繞	絲堯
澆	水堯
饒	食堯
曉	日堯






非	非
匪	#
斐	
俳	人非
徘	彳非
排	手非












東
涷
棟
凍


冬
疼
佟

重
動
鍾


微
薇


谷	
欲
浴
慾
峪









# 皆視作形聲


夫	
扶
芙

氏
紙
祇
衹





高
搞
稿
縞



元
完
烷
浣




博
搏
溥



殳






*/