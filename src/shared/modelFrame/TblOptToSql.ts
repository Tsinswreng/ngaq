import type * as IF from '@shared/modelFrame/IF/I_MkTbl'
import { $a } from '@shared/Common'
import type { UnifyPropType, KeyHandlers } from '@shared/Type'

//type Fn_ParseColOpt

interface I_ColOptParser extends 
	KeyHandlers<Required<IF.Opt_Col>, string>
{

}

interface I_TblOptParser extends 
	KeyHandlers<Required<IF.I_TblOpt>, string>
{

}





class SqliteColOptParser implements I_ColOptParser{
	name: (k: string) => string = (k) => k;
	type: (k: string) => string = (k) => k;
	default: (k: string) => string = (k) => k;
	notNull: (k: boolean) => string = (k) => k ? 'NOT NULL' : '';
	unique: (k: boolean) => string = (k) => k ? 'UNIQUE' : '';
	primaryKey: (k: boolean) => string = (k) => k ? 'PRIMARY KEY' : '';
	//autoIncrement: (k: boolean) => string = (k) => k ? 'AUTO_INCREMENT' : '';
	autoIncrement: (k: boolean) => string = (k) => k ? '' : '';
	check: (k: string) => string = (k) => k ? `CHECK (${k})` : '';
	comment: (k: string) => string = (k) => k ? `COMMENT ${k}` : '';
	constrains: (k: string[]) => string = (k) => k.join(' ');
}

const sqliteColOptParser = new SqliteColOptParser()


interface ParseOpt{
	quote?: (field:str) => str
}


export class ToSql{
	constructor(){if(arguments.length === 0){return}}
	protected __init__(...args: Parameters<typeof ToSql.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return ToSql}

	_tblOpt:IF.I_TblOpt
	_parseOpt?:ParseOpt

	//TODO 改于構造旹
	qt(str:str){
		return `"${str}"`
	}

	_valToArr(obj:Record<str, str>){
		const keys = Object.keys(obj)
		const ans = [] as str[]
		for(const key of keys){
			ans.push(obj[key])
		}
		return ans
	}

	_parseCol(col:IF.Opt_Col){
		const sb = [] as str[]
		const z = this
		const colKeys = Object.keys(col)
		//TODO
		let name = sqliteColOptParser.name(col.name??'')
		let type = sqliteColOptParser.type(col.type??'')
		sb.push(z.qt(name))
		sb.push(' ')
		sb.push(type)
		for(const key of colKeys){
			if(key === 'name' || key === 'type'){
				continue
			}
			const val = col[key]
			const fn = sqliteColOptParser[key]
			if(fn){
				sb.push(' '+fn(val))
			}
		}
		return sb
		// sb.push(z.qt($a(col.name)))
		// sb.push(' ')
		// sb.push($a(col.type))
		// if(col.constrains){
		// 	sb.push(' ')
		// 	sb.push(col.constrains.join(' '))
		// }
		// sb.push(col.unique? ' UNIQUE' : '')
		// sb.push(col.notNull? ' NOT NULL' : '')
		// sb.push(col.default? ` DEFAULT ${col.default}` : '')
		// sb.push(col.comment? ` COMMENT ${col.comment}` : '')
		// sb.push(col.primaryKey ? ' PRIMARY KEY' : '')
		// //
	}

	toSql(){
		const z = this
		const sb = [] as string[]
		//const qt = z._parseOpt?.quote ?? ((field:str) => `"${field}"`)
		sb.push('CREATE TABLE')
		if(z._tblOpt.ifNotExists){
			sb.push(' IF NOT EXISTS')
		}
		sb.push(' '+z.qt(z._tblOpt.name))
		sb.push('(')

		for(let i = 0; i < z._tblOpt.cols.length; i++){
			const col = z._tblOpt.cols[i]
			const usb = z._parseCol(col)
			sb.push(usb.join(''))
			if(i < z._tblOpt.cols.length - 1){
				sb.push(',')
			}
		}
		for(const fk of z._tblOpt.foreignKeys){

		}
		sb.push(')')
		return sb.join('')
	}

}



