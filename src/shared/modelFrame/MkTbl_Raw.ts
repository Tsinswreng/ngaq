import type { I_MkTbl_Raw } from "./IF/I_MkTbl"

class Col{
	constructor(){
		if(arguments.length === 0){return}
	}
	name = ''
	type = ''
	constraints: string[] = []
}

class ForeignKey{
	constructor(){if(arguments.length === 0){return}}
	col = ''
	refTbl = ''
	refCol = ''
	constraints: string[] = []
}

class Index{
	constructor(){if(arguments.length === 0){return}}
	name = ''
	cols: string[] = []
}



class Sql_MkTbl{
	constructor(){if(arguments.length === 0){return}}
	tblName = ''
	ifNotExists = false
	cols: Col[] = []
	foreignKeys: ForeignKey[] = []
	indexes: Index[] = []

	toSql(){
		const z = this
		const sb = [] as str[]
		//let sql = ''
		if(z.ifNotExists){
			sb.push('CREATE TABLE IF NOT EXISTS ')
			//sql += 'CREATE TABLE IF NOT EXISTS '
		}else{
			//sql += 'CREATE TABLE '
			sb.push('CREATE TABLE ')
		}
		//sql += z.tblName + '(\n'
		sb.push(z.tblName + '(\n')
		for(let i = 0; i < z.cols.length; i++){
			const col = z.cols[i]
			sb.push(col.name + ' ' + col.type)
			//sql += col.name + ' ' + col.type
			if(col.constraints.length > 0){
				//sql += ' ' + col.constraints.join(' ')
				sb.push(' ' + col.constraints.join(' '))
			}
			if(i < z.cols.length - 1){
				//sql += ',\n'
				sb.push(',\n')
			}
		}
		if(z.foreignKeys.length > 0){
			//sql += ',\n'
			sb.push(',\n')
			for(let i = 0; i < z.foreignKeys.length; i++){
				const fk = z.foreignKeys[i]
				//sql += 'FOREIGN KEY(' + fk.col + ') REFERENCES ' + fk.refTbl + '(' + fk.refCol + ')'
				sb.push('FOREIGN KEY(' + fk.col + ') REFERENCES ' + fk.refTbl + '(' + fk.refCol + ')')
				if(fk.constraints.length > 0){
					//sql += ' ' + fk.constraints.join(' ')
					sb.push(' ' + fk.constraints.join(' '))
				}
				if(i < z.foreignKeys.length - 1){
					//sql += ',\n'
					sb.push(',\n')
				}
			}
		}
		if(z.indexes.length > 0){
			//sql += ',\n'
			sb.push(',\n')
			for(let i = 0; i < z.indexes.length; i++){
				const idx = z.indexes[i]
				//sql += 'INDEX ' + idx.name + ' (' + idx.cols.join(', ') + ')'
				sb.push('INDEX ' + idx.name + ' (' + idx.cols.join(', ') + ')')
				if(i < z.indexes.length - 1){
					//sql += ',\n'
					sb.push(',\n')
				}
			}
		}
		//sql += '\n)'
		sb.push('\n)')
		const sql = sb.join('')
		return sql
	}
}

/**
 * 不會蔿標識符添引號
 */
export class MkTbl_Raw implements I_MkTbl_Raw{
	constructor(){if(arguments.length === 0){return}}
	protected __init__(...args: Parameters<typeof MkTbl_Raw.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return SqliteMkTbl}

	_opt = new Sql_MkTbl()

	start(){
		return this
	}

	createTable(name:str){
		const z = this
		z._opt.tblName = name
		return z
	}

	ifNotExists(){
		const z = this
		z._opt.ifNotExists = true
		return z
	}

	addCol(name:str, type:str, constraints:str[] = []){
		const z = this
		const col = new Col()
		col.name = name
		col.type = type
		col.constraints = constraints
		z._opt.cols.push(col)
		return z
	}

	toSql(){
		const z = this
		const sql = z._opt.toSql()
		return sql
	}

	foreignKey(col:str, refTbl:str, refCol:str, constraints:str[] = []){
		const z = this
		const fk = new ForeignKey()
		fk.col = col
		fk.refTbl = refTbl
		fk.refCol = refCol
		fk.constraints = constraints
		z._opt.foreignKeys.push(fk)
		return z
	}

	index(name:str, cols:str[]){
		const z = this
		const idx = new Index()
		idx.name = name
		idx.cols = cols
		z._opt.indexes.push(idx)
		return z
	}
}

const mkTbl = MkTbl_Raw.new()

// const sql = mkTbl.createTable('prop').ifNotExists()
// 	.addCol('id', 'integer', ['PRIMARY KEY'])
// 	.addCol('belong', 'text', ['DEFAULT ""'])
// 	.addCol('ct', 'integer')
// 	.addCol('mt', 'integer')
// 	.addCol('wid', 'integer')
// 	.addCol('key', 'text')
// 	.addCol('value', 'text')
// 	.foreignKey('wid', 'TextWord', 'id', ['ON DELETE CASCADE'])
// 	.index('idx', ['key', 'belong'])
// 	.toSql()

// console.log(sql)