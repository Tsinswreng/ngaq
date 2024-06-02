


export class CreateTriggerOpt{
	ifNotExists = false
}

export class CreateIndexOpt{
	ifNotExists = false

}
const IF_NOT_EXISTS = 'IF NOT EXISTS'

class CreateSql{
	
	/** //TODO test
	 * 生成一个用于创建 SQLite 触发器的 SQL 语句，该触发器用于在插入操作时检查是否存在重复的行。
	 * 并在存在重复时用新数据覆盖旧数据。
	 * @param {string} tblName - 表名，触发器将在该表上创建。
	 * @param {string} triggerName - 触发器名称，用于在数据库中标识触发器。
	 * @param {string[]} colNames - 列名数组，触发器将检查重复值的列。
	 * @param {object} opt - 选项对象，包含是否应检查触发器是否已存在的标志（ifNotExists）。
	 * @param {boolean} opt.ifNotExists - 如果为 true，则创建触发器之前检查触发器是否已存在。
	 * @returns {string} 返回一个包含触发器创建 SQL 语句的字符串。
	 */
	static trigger_replaceDuplicate(tblName:str, triggerName:str , colNames:str[], opt:CreateTriggerOpt){

		/** a = NEW.a AND b = NEW.b ... */
		function geneWhere(colNames:str[]):str{
			const arr = colNames.map(e=>{
				return ` ${e}=NEW.${e} `
			})
			return arr.join(' AND ')
		}
		const whereClause = geneWhere(colNames)
		let ifNotExists = ''
		if(opt.ifNotExists){
			ifNotExists = 'IF NOT EXISTS'
		}
		const sql = 
		`CREATE TRIGGER ${ifNotExists} "${triggerName}" 
		BEFORE INSERT ON "${tblName}"
		FOR EACH ROW BEGIN
			SELECT CASE WHEN EXISTS (SELECT 1 FROM "${tblName}" WHERE ${whereClause}) THEN
				UPDATE "${tblName}" SET ${colNames.map(c => `"${c}"=NEW."${c}"`).join(',')} WHERE ${whereClause};
				RAISE(IGNORE)
			END;
		END;
		`
		return sql
	}

	static index(tbl:str, indexName:str, cols:str[], opt:CreateIndexOpt){
		let ifNotExists = ''
		if(opt.ifNotExists){
			ifNotExists = IF_NOT_EXISTS
		}
		const sql = `CREATE INDEX ${ifNotExists} "${indexName}" ON ${tbl} (${cols.join(',')})`
		return sql
	}
}

class SelectSql{

}

export class Sql{
	protected constructor(){}
	static readonly create = CreateSql
	static readonly select = SelectSql
}