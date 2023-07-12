
import VocaRaw from "./VocaRaw"
//const VocaRaw = require('./VocaRaw')
/*
const eng = new VocaRaw();
eng.dbName = 'voca'
eng.tableName = 'eng'
eng.srcFilePath = 'D:\\#\\mmf\\英語\\eng[20230515112601,].txt'
const jap = new VocaRaw()
jap.dbName = 'voca'
jap.tableName = 'jap'
jap.srcFilePath = 'D:\\#\\mmf\\倭\\jap[20230515112439,].txt'
function backup(){
	eng.backupTable()
	jap.backupTable()
}
function addNew(){
	eng.addSingleWordsToDb()
	jap.addSingleWordsToDb()
}*/

let vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig() //第0個昰英語 第1個是日語

function backup(){
	return new Promise<string>((resolve, reject)=>{
		for (let i = 0; i < vocaObjs.length; i++) {
			vocaObjs[i].backupTable().then((result)=>{console.log(result)})
		}
		
	})

}

async function addNew(){
	return new Promise<string>((resolve, reject)=>{
		for (let i = 0; i < vocaObjs.length; i++) {
			vocaObjs[i].addSingleWordsToDb().then((result)=>{console.log(result)})
		}
		resolve('addNew done')
	})

}

backup()

addNew().then((data)=>{
	console.log(data)
})//待叶:輸出ʃ增ᵗ單詞ᵗ量



// 待叶: 把 備份數據庫 與 添詞 之功能 添ᵣ前端ʸ。
/*
源詞表中ᵗ格式:

23.05.15-1130

{

word
美: [wɜrd]
英: [wɜː(r)d]
n.	词；单词；字；消息
v.	措辞；用词
int.	说得对
网络	话；一个字；文字处理

美: [wɜrld]
英: [wɜː(r)ld]
n.	世界；天下；地球；社会
网络	世界音乐；国际；世间

[[言葉
ことば ③
名詞
话，语言，言词。（物の言い方。言葉づかい。）

話し言葉

口语;白话。

書き言葉

书面语;文章语。

田舎言葉

乡音;土话。
]]

}
特定格式ᵗ日期後接一對大括號(目前只支持一種日期格式)、大括號裏放諸詞塊、各詞塊間默認以空行分隔、每詞塊中ᵗ第一行潙詞形、若需單個詞塊中有空行則需用雙重中括號包ᶦ
除被雙重中括號包ᵗ內容外、若某一行ʸ有內容洏其前後ᵗ鄰行皆空行則報錯
* */