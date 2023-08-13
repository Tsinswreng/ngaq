require('tsconfig-paths/register');
import 'module-alias/register';
//import Txt from "@shared/Txt"
import Txt from "Txt"
import Util from 'Util';
import { DictDb, DictRaw, Dict, MinimalPairUtil,ChieneseSyllable } from "./Dict";
//import Txt from "../../shared/Txt";


import { partial } from 'lodash';
import { RegexReplacePair } from 'Type';
import { DictDbRow, cn } from './DictType';
import * as fs from 'fs'
const rootDir:string = require('app-root-path').path
import {replacePair as saffesToOcRegex} from './regex/saffesToOcRegex'
import {replacePair as ocToOc3} from './regex/ocToOc3'
import moment = require('moment');

Error.stackTraceLimit = 50;

async function run(){
	//await DictDb.putNewTable(new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\msdks.dict.yaml'}))
	//await DictDb.putNewTable(new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\dks.dict.yaml'}))
	//await DictDb.attachFreq(new DictDb({}).db, 'essay2')
	let o = new Dict({
		rawObj: new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\saffes.dict.yaml'}),
		name:'dks'
	})
	o.assign_pronounceArr()
	o.pronounceArr = o.pronounceArr.map((e)=>{return e.toUpperCase()}) //轉大寫
	o.preprocess(saffesToOcRegex)
	//o.pronounceArr = Util.serialReplace(o.pronounceArr, saffesToOcRegex)
	o.preprocess(ocToOc3)
	//console.log(saffesToOcRegex)
	o.pronounceArr = o.pronounceArr.map((e)=>{return e.toLowerCase()}) //轉小寫
	console.log(o.pronounceArr)
let 碼表頭 = `#23.08.10-2256
#
# Rime dictionary
# vim: set ts=8 sw=8 noet:
# encoding: utf-8
#匪漢字:[\\x00-\\xff]
#詞:[^\\x00-\\xff]{2,}.*
#空行:^.*\\r\\n$
---
name: ${o.name}
version: ""
sort: by_weight
use_preset_vocabulary: true
import_tables:  #加載其它外部碼表 似不支持多級引入
  #- cangjie7-1ForLookUp2
  - nonKanji
  - chineseDict
...
`
	+
`
不	pha	# pə	
爲	yah	# waj	
爲	yan	# wajs	
的	tx,	# tˁewks	
明	mqs	# mraŋ	
悲	pyh	# prəj	
快	aii	# kʰwrˁets	
需	;fa	# sno	
今	khf	# kəm	
金	kyf	# krəm	
禁	kyv	# krəms	
月	wft	# ŋot	
天	ocd	# lʰˁin	
還	yid	# wrˁen	
牛	uha	# ŋʷə	
三	snf	# sˁəm	ms,sch
三	stf	# srum	bs
夫	paa	# pa	
丘	aha	# kʷʰə	
挺	lxs	# lˁeŋ	
聽	oxx	# lʰeŋs	
他	ozh	# lʰaj	
手	,gq	# nʰuʔ	
意	qhg	# ʔəks	
讀	lvk	# lˁok	
件	gqe	# granʔ	
家	kua	# krˁa	
軍	ihl	# kʷəl
君	kgl	# kul	
羣	kgl	# kul	
群	kgl	# kul	
降	kjx	# krˁuŋs	
夜	rkg	# jAks	
風	pyf	# prəm	
秋	vdj	# tsʰiw	
修	sdj	# siw	
下	guq	# grˁaʔ	舍他音
馬	muq	# mrˁaʔ	
醉	cgi	# tsuts	
詐	cug	# tsrˁaks	
乍	zug	# dzrˁaks	
忽	.bt	# mʰˁut	bs
聞	mgd	# mun	bs
問	mgc	# muns	bs
移	lah	# laj	
由	ldj	# liw	ms
油	ldj	# liw	ms
悠	rdj	# jiw	ms
遊	rga	# ju	
游	rga	# ju	

未	mhi	# məts	
調	dcm	# diws	
先	snd	# sˁən	


紙	ksq	# keʔ	
氏	gsq	# ɡeʔ	
運	yh.	# wəls	
羣	ggl	# gul	

連	rqd	# ran	
掩	qqr	# ʔramʔ
抑	qdk	# ʔik
訴	szg	# sˁaks
低	tca	# tˁi
信	,dx	# nʰiŋs
限	gme	# ɡrˁənʔ
地	lzn	# lˁajs
结	kct	# kˁit
合	gvp	# ɡˁop	bs
皆	koh	# krˁij
世	oab	# lʰaps
大	lzi	# lˁats
啼	lxa	# lˁe
弟	lcq	# lˁiʔ
遞	lxq	# lˁeʔ

級	khp	# kəp
急	kyp	# krəp
然	nad	# nan
服	bhk	# bək
伏	bhg	# bəks

電	lcc	# lˁins	
殿	tnc	# tˁəns
澱	dnc	# dˁəns
路	ruz	# rˁas
露	rug	# rˁaks
川	xgd	# kʰun

場	lqs	# lraŋ
計	kdn	# kijs
係	kxg	# kˁeks
釋	okk	# lʰAk
變	prc	# prons
即	cdk	# tsik
唧	cdk	# tsik

唯	ydy	# wijʔ
維	ygh	# wuj	bs
惟	ydh	# wij
嘆	,zc	# nʰˁans
歎	,zc	# nʰˁans
炭	ozc	# lʰˁans
億	qhk	# ʔək
憶	qyk	# ʔrək
亦	rak	# jak
易	lsg	# leks
書	;aa	# sta
十	gdp	# ɡip

兄	.qs	# mʰraŋ
願	wfc	# ŋons
替	,ci	# nʰˁits
西	snh	# sˁəj
道	lbu	# lˁuʔ
皇	yzs	# wˁaŋ
明	mqs	# mraŋ
箭	csc	# tsens
濺	cac	# tsans
山	sqd	# sran
期	gya	# ɡrə
奇	kah	# kaj	舍他音
陰	qgf	# ʔum	bs
較	kim	# krˁews	舍他音
裏	myq	# mrəʔ	bs
裡	myq	# mrəʔ	bs
赴	ffg	# pʰoks
飛	phl	# pəl	bs
氣	xhb	# kʰəps	bs
池	lqh	# lraj

雇	izz	# kʷˁas
鼓	izq	# kʷˁaʔ
況	.ax	# mʰaŋs
向	,ax	# nʰaŋs

荒	.zs	# mʰˁaŋ
謊	.zw	# mʰˁaŋʔ
相	sax	# saŋs	舍他音
符	bfa	# bo
妹	mni	# mˁəts
烘	hvs	# hˁoŋ	舍他音
裝	cqs	# tsraŋ	舍他音
磨	mzn	# mˁajs	舍他音
麼	mzy	# mˁajʔ
門	mnl	# mˁəl	bs
鶴	gz,	# ɡˁawk
脫	ovt	# lʰˁot
#舊	uhz	# ɡʷəs
尚	dax	# daŋs	舍他音
上	daw	# daŋʔ	舍他音
雲	yhd	# wən
云	yhl	# wəl
但	dzc	# dˁans	舍他音
彈	dzd	# dˁan	舍他音
對	tbb	# tˁups
沒	mnt	# mˁət
歿	mbt	# mˁut
竟	kqx	# kraŋs
競	gqx	# ɡraŋs
京	kqs	# kraŋ
景	kqw	# kraŋʔ
華	yua	# wrˁa	舍他音
雄	yhs	# wəŋ
熊	yhf	# wəm
吐	ezz	# tʰˁas	舍他音
兔	ozz	# lʰˁas
卻	xak	# kʰak	舍他音
却	xak	# kʰak	舍他音
眼	wme	# ŋrˁənʔ
米	mcq	# mˁiʔ
迷	mca	# mˁi
離	rqh	# raj
忘	max	# maŋs	舍他音
放	pax	# paŋs	舍他音
王	yas	# waŋ	舍他音
或	ynk	# wˁək
辯	bwe	# brenʔ
辦	bic	# brˁens
煙	qcd	# ʔˁin
烟	qcd	# ʔˁin
衣	qyh	# ʔrəj
唐	rzs	# jˁaŋ
糖	lzs	# lˁaŋ
了	riu	# rˁewʔ	舍他音
太	ozi	# lʰˁats
朝	tqj	# traw	舍他音
臨	rtf	# rum	bs
霰	sxc	# sˁens
見	kxc	# kˁens	舍他音
視	gdy	# gijʔ
示	gdn	# gijs
覺	kjk	# krˁuk
角	kpk	# krˁok
確	xu,	# kʰrˁawk
久	ihq	# kʷəʔ
玖	ihq	# kʷəʔ
灸	ihq	# kʷəʔ
串	xpc	# kʰrˁons
`
+
`

猶	lga	# lu	ts
有	ygq	# wuʔ	ts
又	ygz	# wus	ts
聯	rrd	# ron	ts
給	krp	# krop	ts
使	sya	# srə	ts
何	gzy	# ɡˁajʔ	ts
#行	gzx	# ɡˁaŋs	ts
航	gzx	# ɡˁaŋs	ts
啊	qzn	# ʔajs	ts
男	nvf	# nˁom	ts
詞	shq	# səʔ	ts
乎	gaz	# ɡas	ts
里	.ya	# mʰə	ts
理	.yq	# mʰəʔ	ts
#郎	
馳	dqh	# draj	ts
顧	iuz	# kʷrˁas	ts
固	kuz	# krˁas	ts
估	kuq	# krˁaʔ	ts
鄉	,as	# nʰaŋ	ts
享	hqw	# hraŋʔ	ts
洪	gfs	# ɡoŋ	ts
虹	gps	# ɡrˁoŋ	ts
鴻	gpw	# ɡrˁoŋʔ	ts
莊	cqw	# tsraŋʔ	ts
妝	zqw	# dzraŋʔ	ts
什	dhv	# dəms	ts	「甚」之轉
什	gep	# ɡrip	ts
閣	kzg	# kˁaks	ts
們	mnd	# mˁən	ts
漢	hzc	# hˁans	ts
嘗	dks	# dAŋ	ts
嚐	dkx	# dAŋs	ts
償	;as	# staŋ	ts
鏡	gqw	# ɡraŋʔ	ts 
帖	oxp	# lʰˁep	ts
望	mzx	# mˁaŋs	ts	或用mAŋs
妄	fzx	# pʰˁaŋs	ts
惑	ymk	# wrˁək	ts
辨	pwe	# prenʔ	ts
伺	vhz	# tsʰəs	ts
思	shz	# səs	ts
司	vha	# tsʰə	ts
淋	ryv	# rəms	ts
午	wuq	# ŋrˁa	ts
`
//加頻重碼率算法有問題。蔿已有的字新增讀音不應使重碼率下降。
	
	let path = 'D:\\Program Files\\Rime\\User_Data\\dks.dict.yaml'
	let db = new DictDb({}).db
	let table = 'dks'
	o.outputToFile(path, 碼表頭)
	
	await DictDb.putNewTable(new DictRaw({srcPath:path}))
	await DictDb.attachFreq(db, table)
	await o.countAll()
	console.log(o.加頻重碼率)
	async function p(){
		let rows = await DictDb.selectAll(db, table)
		let pairs = await DictDb.findMinimalPairs(rows, '^()(a)(.*)$', 'x')
		console.log(pairs)
		let freqSum = await DictDb.getSum(new DictDb({}).db, table, 'freq')
		let sumArr = await MinimalPairUtil.sumFreq(db, table, pairs)
		console.log(`console.log(pairs)`)
		console.log(pairs)
		console.log(`console.log(pairs.length)`)
		console.log(pairs.length)
		console.log(`console.log(sumArr)`)
		console.log(sumArr)
		console.log([sumArr[0]/freqSum*100+'%',sumArr[1]/freqSum*100+'%'])
		console.log(((sumArr[0]+sumArr[1])/freqSum)*100+'%')
		console.log(`console.log(freqSum)`)
		console.log(freqSum)
	}
	await DictDb.dropTable(db, table)
}
//run()

class Dks{
	static dksPath = 'D:\\Program Files\\Rime\\User_Data\\dks.dict.yaml'
	static saffesPath = rootDir+'/src/backend/src/dict/原表/saffes.dict.yaml'
	static dkzPath = rootDir+'/src/backend/src/dict/原表/dkz.dict.yaml'
	static dkpPath = rootDir+'/src/backend/src/dict/原表/dkp.dict.yaml'
	static targetDkpPath = 'D:\\Program Files\\Rime\\User_Data\\dkp.dict.yaml'
	static db = new DictDb({})
	static dksHead = 
`
#${moment().format('YYYYMMDDHHmmss')}
#
# Rime dictionary
# vim: set ts=8 sw=8 noet:
# encoding: utf-8
#匪漢字:[\\x00-\\xff]
#詞:[^\\x00-\\xff]{2,}.*
#空行:^.*\\r\\n$
---
name: dks
version: ""
sort: by_weight
use_preset_vocabulary: true
import_tables:  #加載其它外部碼表 似不支持多級引入
  #- cangjie7-1ForLookUp2
  - nonKanji
  - chineseDict
...
`
	tempTable:string = ''
	saffes = new Dict({rawObj:new DictRaw({srcPath:Dks.saffesPath})})
	dkp = new Dict({rawObj:new DictRaw({srcPath:Dks.dkpPath})})
	dkz?:Dict

	assign_dkz(){
		this.dkz = new Dict({rawObj:new DictRaw({srcPath:Dks.dkzPath})})
	}

	saffesToDkz(){
		//console.log(1919)
		let saffes = this.saffes
		saffes.assign_pronounceArr()
		saffes.pronounceArr = saffes.pronounceArr.map((e)=>{return e.toUpperCase()})
		saffes.preprocess(saffesToOcRegex)

		saffes.outputToFile(Dks.dkzPath, Dict.getSimpleHead('dkz'))

		//console.log(114514)
		//console.log(saffes.pronounceArr)//t
		//Txt.mergeArrIntoStr()
	}

	getCharOfDkp(){
		let dkp = this.dkp
		//console.log(`console.log(dkp.rawObj.validBody)`)
		//console.log(dkp.rawObj.validBody)
		let charSet = Util.transpose(dkp.rawObj.validBody, '')[0]
		//charSet = Array.from(new Set([...charSet]))
		//console.log(`console.log(charSet)`)
		//Util.printArr(charSet)
		return charSet
	}

	async putTempInDb(body:string[][]){
		this.tempTable = 'temp'+moment().format('YYYYMMDDHHmmss')
		await DictDb.creatTable(Dks.db.db, this.tempTable)
		let columns = cn.char+','+cn.code+','+cn.ratio
		let sql = `INSERT INTO '${this.tempTable}' (${columns}) VALUES (?,?,?)`
		return DictDb.transaction(Dks.db.db, sql, body)
	}
	
	async putDkzInDb(){
		this.assign_dkz()
		let dkz = this.dkz
		let body = Util.transpose(dkz!.rawObj.validBody, '').slice(0,3)
		body = Util.transpose(body)
		//console.log(body)
		
		return this.putTempInDb(body)
	}

	async removeCharsInDb(table:string, chars:string[]){
		let sql = `DELETE FROM '${table}' WHERE ${cn.char}=?`
		return DictDb.transaction(Dks.db.db, sql, chars)
	}

	async dropTempTable(){
		let sql = `DROP TABLE '${this.tempTable}'`
		return DictDb.all(Dks.db.db, sql)
	}

	async updateDkzFile(){
		
		let charsToBeRemoved = this.getCharOfDkp()
		await this.removeCharsInDb(this.tempTable, charsToBeRemoved)
		let strArr = await DictDb.toStrTable(Dks.db.db, this.tempTable, [cn.char, cn.code, cn.ratio])
		let dkpBody = this.dkp.rawObj.validBody
		let dkpStr = Txt.mergeArrIntoStr(dkpBody)
		//console.log(dkpStr)//t
		let str = Txt.mergeArrIntoStr(strArr)
		str = Dict.getSimpleHead('dkz')+'\n'+dkpStr+'\n'+str
		//console.log(`console.log(str)`)
		//console.log(str.slice(0,999))
		fs.writeFileSync(Dks.dkzPath, str)
	}

	updateDks(){
		this.assign_dkz()
		let dkz = Util.nonNullableGet(this.dkz)
		dkz.assign_pronounceArr()
		//this.dkz.pronounceArr = this.dkz.pronounceArr.map((e)=>{return e.toUpperCase()})
		dkz.preprocess(ocToOc3)
		dkz.pronounceArr = dkz.pronounceArr.map((e)=>{return e.toLowerCase()})
		//console.log(`console.log(this.dkz.rawObj.validBody)`)
		//console.log(dkz.rawObj.validBody)
		//console.log(`console.log(this.dkz.pronounceArr)`)
		//console.log(this.dkz.pronounceArr)
		dkz.outputToFile(Dks.dksPath, Dks.dksHead)
	}

	copyDkp(){
		fs.copyFileSync(Dks.dkpPath, Dks.targetDkpPath)
	}

	async countRate(){
		let tempTable = 'temp2_'+moment().format('YYYYMMDDHHmmss')
		let o = new Dict(new DictRaw({srcPath:Dks.dksPath, name:tempTable}))
		await DictDb.putNewTable(new DictRaw({srcPath:Dks.dksPath, name:tempTable}))
		await DictDb.attachFreq(Dks.db.db, tempTable)
		await o.countAll()
		console.log(`console.log(o.無重複漢字數)`)
		console.log(o.無重複漢字數)
		console.log(`console.log(o.無重複音節數)`)
		console.log(o.無重複音節數)
		console.log(`console.log(o.加頻重碼率)`)
		console.log(o.加頻重碼率)
		let 頻ˋ大於950之字ᵗ頻ᵗ和 = await o.get_字頻總和(950)
		let 頻ˋ大於950之字ᵗ重碼頻數 = await o.get_重碼頻數(950)
		let 頻ˋ大於950之字ᵗ加頻重碼率 = 頻ˋ大於950之字ᵗ重碼頻數/頻ˋ大於950之字ᵗ頻ᵗ和
		console.log(`console.log(頻于前950之字ᵗ加頻重碼率)`)
		console.log(頻ˋ大於950之字ᵗ加頻重碼率)

		await DictDb.dropTable(Dks.db.db, tempTable)
	}

	static async run(){
		let o = new Dks()
		
		o.saffesToDkz()
		await o.putDkzInDb()
		await o.updateDkzFile()
		// //console.log(114514)
		await o.dropTempTable()
		o.updateDks()
		o.copyDkp()
		o.countRate()
	}
}
//Dks.saffesToDkz()
Dks.run()


/*

# 的	a
# 一	a
# 是	a
# 了	a
# 我	a
# 有	a
# 啊	a
# 在	a


*/