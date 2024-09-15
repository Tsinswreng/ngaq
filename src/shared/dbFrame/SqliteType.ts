import {I_Types} from './I_Types'
import {Type} from './Type'

const T = Type.new.bind(Type)

class SqliteType implements I_Types{
	readonly int64 = T('INTEGER')
	readonly real = T('REAL')
	readonly text = T('TEXT')
}

export const sqliteType = new SqliteType()
