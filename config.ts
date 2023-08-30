import {VocaRawConfig} from 'Type'

export const config:VocaRawConfig = {
	dbName:"voca",
	dbPath:"",
	url:"http://127.0.0.1:1919",
	dateFormat:'YYYYMMDDHHmmssSSS',
	dateRegex: '\\d{17}',
	dateBlock: ['\\{','\\}'],
	wordBlock: ['\\[{2}','\\]{2}'],
	annotation: ['<<','>>'],
	txtTables: 
	[
		{
			ling:"english",
			path:".\\srcWordList\\eng\\eng.voca"
		},
		{
			ling:"japanese",
			path:".\\srcWordList\\jap\\jap[20230515112439,].txt"
		}
	]
}

