import { IVocaRow } from "@shared/SingleWord2"
import SingleWord2 from "@shared/SingleWord2"

/* const words:IVocaRow[] = 
[
	{ "id": 1, "wordShape": "〜からには", "mean": "[\"文法\\n表示“既然……就……”的意思。 \\n\\n与「〜以上」「上は」意义上比较相似。后续多为决心、判断、义务等说法。「からは」带有古文语气，表示同样的意义不常用。 接续：动词连体形+からには / 名词+である+からには\"]", "annotation": "[]", "times_add": 1, "dates_add": "[\"2023.09.02-19:11:15.000\"]", "times_rmb": 0, "dates_rmb": "[]", "times_fgt": 0, "dates_fgt": "[]", "tag": "[]", "ling": "english" } ,
	{ "id": 2, "wordShape": "gossip", "mean": "[\"美: [ˈɡɑsɪp] \\n英: [ˈɡɒsɪp] \\nv.\\t说长道短\\nn.\\t流言；好嚼舌的人\\n网络\\t八卦板；闲聊；闲言碎语\",\"gggg\"]", "annotation": "[]", "times_add": 2, "dates_add": "[\"2023.09.02-19:11:15.000\",\"2023.09.02-19:12:10.000\"]", "times_rmb": 0, "dates_rmb": "[]", "times_fgt": 0, "dates_fgt": "[]", "tag": "[]", "ling": "english" } ,
	{ "id": 3, "wordShape": "obscene", "mean": "[\"美: [ɑbˈsin] \\n英: [əbˈsiːn] \\nadj.\\t淫秽的；猥亵的；下流的；（数量等）大得惊人的\\n网络\\t淫亵；淫猥\"]", "annotation": "[\"test2\"]", "times_add": 2, "dates_add": "[\"2023.09.02-19:11:15.000\",\"2023.09.02-19:11:58.001\"]", "times_rmb": 0, "dates_rmb": "[]", "times_fgt": 0, "dates_fgt": "[]", "tag": "[]", "ling": "english" } ,
	{ "id": 4, "wordShape": "devilish", "mean": "[\"英 [ˈdevəlɪʃ]美 [ˈdevəlɪʃ]\\n\\nTEM4\\nadj. 邪恶的；精力旺盛的；魔鬼似的\\nadv. 非常；极度地\"]", "annotation": "[\"test\"]", "times_add": 1, "dates_add": "[\"2023.09.02-19:11:15.000\"]", "times_rmb": 0, "dates_rmb": "[]", "times_fgt": 0, "dates_fgt": "[]", "tag": "[]", "ling": "english" } ,
	{ "id": 5, "wordShape": "run-of-the-mill", "mean": "[\"美: \\n英: \\nadj.\\t平凡的；普通的；乏味的\\n网络\\t一般的；平常的；非选拔的\"]", "annotation": "[]", "times_add": 2, "dates_add": "[\"2023.09.02-19:11:15.000\",\"2023.09.02-19:11:58.001\"]", "times_rmb": 0, "dates_rmb": "[]", "times_fgt": 0, "dates_fgt": "[]", "tag": "[]", "ling": "english" } ,
	{ "id": 6, "wordShape": "怠い", "mean": "[\"だるい ②◎ \\n形容詞\\n懒倦的，慵懒的，发酸的，又懒又乏的。（疲れていて、からだに力がない。動くのがおっくうである。）\"]", "annotation": "[]", "times_add": 1, "dates_add": "[\"2023.09.02-19:11:58.001\"]", "times_rmb": 0, "dates_rmb": "[]", "times_fgt": 0, "dates_fgt": "[]", "tag": "[]", "ling": "english" } ,
	{ "id": 7, "wordShape": "是", "mean": "[\"不\"]", "annotation": "[]", "times_add": 1, "dates_add": "[\"2023.09.02-19:12:10.000\"]", "times_rmb": 0, "dates_rmb": "[]", "times_fgt": 0, "dates_fgt": "[]", "tag": "[]", "ling": "english" } ,
]
 */

const words:SingleWord2[] = []
let w = new SingleWord2(
	{
		id:1,
		ling: 'english',
		wordShape: 'object',
		pronounce: [`ˈɒbdʒɪkt`, `əbˈdʒekt`],
		mean: [`n.	目标；物体；目的；东西
		v.	反对；不同意；不赞成；提出…作为反对的理由
		网络	对象；物件；宾语`, `英 [ˈɒbdʒɪkt; əbˈdʒekt]美 [ˈɑːbdʒekt]
		CET4 TEM4
		n. 物体，实物；目的，目标；宾语；（引发某种情感或行为的）对象；客体；（计算机）对象
		v. 反对；反对说，反对的理由是`],
		tag: ['CET-4', 'TEM-4'],
		annotation: ['對象', '反對', '目標'],
		dates_add: ['2023.09.06-18:22:13.001', '2023.09.06-18:22:26.002'],
		dates_fgt: ['2023.09.06-18:25:01.003', '2023.09.06-18:25:11.004'],
		dates_rmb: ['2023.09.06-18:25:27.005', '2023.09.06-18:25:35.006']
	}
)
for(let i = 0; i < 10; i++){
	//let e:SingleWord2 = JSON.parse(JSON.stringify(w)) //會失 get方法
	let e = SingleWord2.parse(SingleWord2.fieldStringfy(w))
	e['_id']= i
	words.push(e)
}
//console.log(words)
export default words