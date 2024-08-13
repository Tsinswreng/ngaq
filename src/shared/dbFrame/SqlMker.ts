import { I_Tbls } from "./I_Tbls"

type JoinType = 'LEFT' | 'RIGHT' | 'FULL' | 'INNER' | 'CROSS' | ''
class Join{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Join.new>){
		const z = this
		z.tbl = args[0]
		z.on = args[1]
		z.type = args[2]
		return z
	}

	static new(tbl:str, on:str, type:JoinType){
		const z = new this()
		z.__init__(tbl, on, type)
		return z
	}
	type: JoinType = ''
	tbl:str = ''
	on:str = ''

	//get This(){return Join}
}


export class SqlAns_select{
	ans = ''
	select:str[] = []
	from:str = ''
	where:str = ''
	groupBy:str[] = []
	orderBy:str[] = []
	having:str = ''
	limit:str = ''
	/** 整個JOIN子句 如 LEFT JOIN xxx ON xxx */
	join:Join
}

export class SqlMker_select{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof SqlMker_select.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return SqlMker_select}

	protected _ans:SqlAns_select
	protected get ans(){return this._ans}
	protected set ans(v){this._ans = v}

	protected started = false
	
	start(){
		const z = this
		if(z.started){
			throw new Error(`cannot call start() twice`)
		}
		z.started = true
		z._ans = new SqlAns_select()
		return z
	}

	end(){
		const z = this
		let where = ''
		if(z.ans.where !== ''){
			where = `WHERE ${z.ans.where}`
		}
		let groupBy = ''
		if(z.ans.groupBy.length > 0){
			groupBy = ` GROUP BY ${z.ans.groupBy.join(', ')}`
		}
		let having = ''
		if(z.ans.having !== ''){
			having = ` HAVING ${z.ans.having}`
		}
		let orderBy = ''
		if(z.ans.orderBy.length > 0){
			orderBy = ` ORDER BY ${z.ans.orderBy.join(', ')}`
		}
		let limit = ''
		if(z.ans.limit !== ''){
			limit = ` LIMIT ${z.ans.limit}`
		}
		let join = ''
		if(z.ans.join != void 0){
			join = `${z.ans.join.type} JOIN ${z.ans.join.tbl} ON ${z.ans.join.on}`
		}
		const ans = 
`SELECT ${z._ans.select.join(', ')}
FROM ${z._ans.from}
${join}
${where}
${groupBy}
${having}
${orderBy}
${limit}`
		z.started = false
		return ans
	}

	// select(c:str|str[]){
	// 	const z = this
	// 	if(typeof c === 'string'){
	// 		return z._selectArr([c])
	// 	}
	// 	return z._selectArr(c)
	// }

	select(
		cols:str[]
	){
		const z = this
		//const cols = fn(z.tbls)
		z._ans.select.push(...cols)
		return z
	}
	from(
		tbl:str
	){
		const z = this
		//const tbl = fn(z.tbls)
		z._ans.from = tbl
		return z
	}

	where(
		cond:str
	){
		const z = this
		z._ans.where = cond
		return z
	}

	orderBy(
		cols:str[]
	){
		const z = this
		z._ans.orderBy.push(...cols)
		return z
	}
	groupBy(
		cols:str[]
	){
		const z = this
		z._ans.groupBy.push(...cols)
		return z
	}

	having(
		cond:str
	){
		const z = this
		//const cond = fn(z.tbls)
		z._ans.having = cond
		return z
	}

	limit(
		cond:str
	){
		const z = this
		z._ans.limit = cond
		return z
	}
	// join_(
	// 	type: 'LEFT' | 'RIGHT' | 'FULL' | 'INNER' | 'CROSS' | ''
	// 	,opt: { table: string, on: string }
	// ) {
	// 	const z = this;
	// 	const { table, on } = opt
	// 	const joinClause = `${type} JOIN ${table} ON ${on}`;
	// 	z._ans.join = (joinClause);
	// 	return z;
	// }

	join(
		table:string, on:string
		, type: 'LEFT' | 'RIGHT' | 'FULL' | 'INNER' | 'CROSS' | '' = ''
	){
		const z = this;
		const join = Join.new(table, on, type)
		z._ans.join = join
		// const joinClause = `${type} JOIN ${table} ON ${on}`;
		// z._ans.join = (joinClause);
		return z
	}

}






// class SqlMker_select_Tbls<Tbls_t extends I_Tbls>{
// 	protected constructor(){}
// 	protected __init__(...args: Parameters<typeof SqlMker_select_Tbls.new>){
// 		const z = this
// 		//@ts-ignore
// 		z.tbls = args[0]
// 		return z
// 	}

// 	static new<Tbls_t extends I_Tbls>(tbls:Tbls_t){
// 		const z = new this<Tbls_t>()
// 		z.__init__(tbls)
// 		return z
// 	}

// 	//get This(){return SqlMker}
// 	protected _tbls:Tbls_t
// 	get tbls(){return this._tbls}
// 	set tbls(v){this._tbls = v}

// 	protected _ans:SqlAns_select
// 	protected get ans(){return this._ans}
// 	protected set ans(v){this._ans = v}
	
// 	start(){
// 		this._ans = new SqlAns_select()
// 		return this
// 	}

// 	end(){
// 		const z = this
// 		let where = ''
// 		if(z.ans.where !== ''){
// 			where = ` ${z.ans.where}`
// 		}
// 		let groupBy = ''
// 		if(z.ans.groupBy.length > 0){
// 			groupBy = ` GROUP BY ${z.ans.groupBy.join(', ')}`
// 		}
// 		let having = ''
// 		if(z.ans.having !== ''){
// 			having = ` HAVING ${z.ans.having}`
// 		}
// 		let orderBy = ''
// 		if(z.ans.orderBy.length > 0){
// 			orderBy = ` ORDER BY ${z.ans.orderBy.join(', ')}`
// 		}
// 		let limit = ''
// 		if(z.ans.limit !== ''){
// 			limit = ` LIMIT ${z.ans.limit}`
// 		}
// 		let join = z.ans.join.length > 0 ? z.ans.join : ''; // 处理 JOIN 语
// 		const ans = 
// `SELECT ${z._ans.select.join(', ')}
// FROM ${z._ans.from}
// ${join}
// ${where}
// ${groupBy}
// ${having}
// ${orderBy}
// ${limit}`
// 		return ans
// 	}

// 	select(
// 		fn:(tbl:typeof this.tbls)=>str[]
// 	){
// 		const z = this
// 		const cols = fn(z.tbls)
// 		z._ans.select.push(...cols)
// 		return z
// 	}
// 	from(
// 		fn:(tbl:typeof this.tbls)=>str
// 	){
// 		const z = this
// 		const tbl = fn(z.tbls)
// 		z._ans.from = tbl
// 		return z
// 	}

// 	where(
// 		fn:(tbl:typeof this.tbls)=>str
// 	){
// 		const z = this
// 		const cond = fn(z.tbls)
// 		z._ans.where = cond
// 		return z
// 	}

// 	orderBy(
// 		fn:(tbl:typeof this.tbls)=>str[]
// 	){
// 		const z = this
// 		const cols = fn(z.tbls)
// 		z._ans.orderBy.push(...cols)
// 		return z
// 	}
// 	groupBy(
// 		fn:(tbl:typeof this.tbls)=>str[]
// 	){
// 		const z = this
// 		const cols = fn(z.tbls)
// 		z._ans.groupBy.push(...cols)
// 		return z
// 	}

// 	having(
// 		fn:(tbl:typeof this.tbls)=>str
// 	){
// 		const z = this
// 		const cond = fn(z.tbls)
// 		z._ans.having = cond
// 		return z
// 	}

// 	limit(
// 		fn:(tbl:typeof this.tbls)=>str
// 	){
// 		const z = this
// 		const cond = fn(z.tbls)
// 		z._ans.limit = cond
// 		return z
// 	}
// 	join(
// 		type: 'LEFT' | 'RIGHT' | 'FULL' | 'INNER' | 'CROSS' | ''
// 		, fn: (tbl: typeof this.tbls) => { table: string, on: string }
// 	) {
// 		const z = this;
// 		const { table, on } = fn(z.tbls);
// 		const joinClause = `${type} JOIN ${table} ON ${on}`;
// 		z._ans.join = (joinClause);
// 		return z;
// 	}
// }

/* 

已知類Tbls中所有成員都是Tbl類的實例、而類Tbl中有成員 叫col、儲存了該表的所有列名、如col.id = 'id';
有成員叫name、儲存了該表的名稱
請你寫一個sql查詢構建器。如
sql()
.select(tbl=>[tbl.user.col.id, tbl.user.col.name])
.from(tbl=>tbl.user.name)
.where(tbl=>`${tbl.user.col.id} = ?`)
.build()
返回 SELECT user.id, user.name FROM user WHERE user.id = ?
上面只是一個示例、你多弄點功能。用ts
*/