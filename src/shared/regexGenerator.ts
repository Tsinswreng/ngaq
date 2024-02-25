import 'tsconfig-paths/register'
import { $ } from '@shared/Ut'
import * as algo from '@shared/algo'

function jp(){
	const f = algo.geneRegexReplacePair
	const aeiou = ['a','e','i','o','u']
	const zxcvb = ['z','x','c','v','b']
	const ans = [] as  string[][]
	let u = [] as string[][]
	u=f(
		['(x.)',aeiou,'$']
		,['$1',zxcvb]
	)
	ans.push(...u)
	console.log(ans)
}


const hiraganaToKatakanaMap: { [key: string]: string } = {
    'あ': 'ア', 'い': 'イ', 'う': 'ウ', 'え': 'エ', 'お': 'オ', 'か': 'カ', 'き': 'キ', 'く': 'ク', 'け': 'ケ', 'こ': 'コ',
    'さ': 'サ', 'し': 'シ', 'す': 'ス', 'せ': 'セ', 'そ': 'ソ', 'た': 'タ', 'ち': 'チ', 'つ': 'ツ', 'て': 'テ', 'と': 'ト',
    'な': 'ナ', 'に': 'ニ', 'ぬ': 'ヌ', 'ね': 'ネ', 'の': 'ノ', 'は': 'ハ', 'ひ': 'ヒ', 'ふ': 'フ', 'へ': 'ヘ', 'ほ': 'ホ',
    'ま': 'マ', 'み': 'ミ', 'む': 'ム', 'め': 'メ', 'も': 'モ', 'や': 'ヤ', 'ゆ': 'ユ', 'よ': 'ヨ', 'ら': 'ラ', 'り': 'リ',
    'る': 'ル', 'れ': 'レ', 'ろ': 'ロ', 'わ': 'ワ', 'ゐ': 'ヰ', 'ゑ': 'ヱ', 'を': 'ヲ', 'ん': 'ン',
    'が': 'ガ', 'ぎ': 'ギ', 'ぐ': 'グ', 'げ': 'ゲ', 'ご': 'ゴ', 'ざ': 'ザ', 'じ': 'ジ', 'ず': 'ズ', 'ぜ': 'ゼ', 'ぞ': 'ゾ',
    'だ': 'ダ', 'ぢ': 'ヂ', 'づ': 'ヅ', 'で': 'デ', 'ど': 'ド', 'ば': 'バ', 'び': 'ビ', 'ぶ': 'ブ', 'べ': 'ベ', 'ぼ': 'ボ',
    'ぱ': 'パ', 'ぴ': 'ピ', 'ぷ': 'プ', 'ぺ': 'ペ', 'ぽ': 'ポ',
    'ゔ': 'ヴ', 'ゕ': 'ヵ', 'ゖ': 'ヶ',
    'ぁ': 'ァ', 'ぃ': 'ィ', 'ぅ': 'ゥ', 'ぇ': 'ェ', 'ぉ': 'ォ', 'ゃ': 'ャ', 'ゅ': 'ュ', 'ょ': 'ョ', 'っ': 'ッ'
};

function convertHiraganaToKatakana(hiragana: string): string {
    let katakana = '';
    for (let char of hiragana) {
        katakana += hiraganaToKatakanaMap[char] || char;
    }
    return katakana;
}

//const hiraganaInput = 'あえいおうぁぇぃぉぅぱぺぴぽぷばべびぼぶヷヹヸヺヷたてちとつだでぢどづダデヂドヅさせしそすサセシソスざぜじぞずザゼジゾズかけきこくカケキコクがげぎごぐガゲギゴグはへひほふハヘヒホフやよゆヤヨユゃょゅャョュッんんっ';
import * as fs from 'fs'
const path = 'D:\\Program Files\\Rime\\User_Data\\dks-hirakana.dict.yaml'
const hiraganaInput = fs.readFileSync(path, {encoding:'utf-8'})
const katakanaOutput = convertHiraganaToKatakana(hiraganaInput);
console.log(katakanaOutput);

