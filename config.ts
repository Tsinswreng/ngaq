import {VocaRawConfig} from 'Type'

export const config:VocaRawConfig = {
	dbName:"voca",
	dbPath:"",
	url:"http://127.0.0.1:1919",
	dateFormat:'YYYY.MM.DD-HH:mm:ss.SSS',
	dateRegex: '\\d{4}\\.\\d\\d\\.\\d\\d\\-\\d\\d:\\d\\d:\\d\\d\\.\\d{3}', //勿寫^...$
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

