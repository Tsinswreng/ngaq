import type * as IF from '@shared/modelFrame/IF/I_MkTbl'
import {MkTbl} from '@shared/modelFrame/MkTbl_Sqlite'
import {ToSql} from '@shared/modelFrame/TblOptToSql'

describe('MkTbl', () => {

	const mkTbl = MkTbl.new()

	const tblOpt = mkTbl.createTable('Prop').ifNotExists()
		.addCol('id', 'INTEGER', {primaryKey: true, autoIncrement: true})
		.addCol('belong', 'TEXT', {notNull: true})
		.addCol('ct', 'INTEGER', {notNull: true})
		.addCol('mt', 'INTEGER', {notNull: true})
		.addCol('wid', 'INTEGER', {notNull: true})
		.foreignKey('wid', 'TextWord', 'id', {})
		.index('idx_belong_ct_mt', ['belong', 'ct', 'mt'])
	.getTblOpt()
	
	//console.log(tblOpt)

	const toSql = new ToSql()
	toSql._tblOpt = tblOpt
	console.log(toSql.toSql())

})



// class User{
// 	createTime:number
// }
// const user = new User()

// const sql1 = `SELECT * FROM User where createTime = 1234567890`

// const sql2 = `SELECT * FROM User where ${nameof(user.createTime)} = ?`