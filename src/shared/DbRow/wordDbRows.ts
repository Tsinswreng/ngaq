/* 
現在我要用typescript和sqlite數據庫交互、不用關係映射
有以下需求:
1.需要把列名和表名等名稱存在變量中、禁止在sql中硬編碼
如 const sql = `SELECT * FROM ${tbls.user.tbl_name} WHERE ${tbls.user.col.id}=?`

2.需要有表示數據庫的行的類型 如用UserRow表示user表中的每一行
如 const result = await db.all<UserRow>(sql......)
則推斷出result 是 UserRow[] 類型

3.除此外還需一個表示程序中的user對象的類、該類與UserRow有些許不同

如

class UserRow{
	id:int
	name:str
	createdTime:int //在數據庫中用int64儲存時間
}

class User{
	id:int
	name:str
	createdTime:Time //在程序中用Time實例表示時間
}

需要有 Obj和Row相互轉化的方法

如
declare let userRow:UserRow
const user:User = User.fromRow(userRow) //userRow轉程序對象
user.toRow() //程序對象轉數據庫對象

下面是我原來的做法。
當數據庫中的表很多時、就很麻煩了。幫我想一種設計模式、簡化代碼。

*/


export class Col{
	readonly id='id'
	readonly belong='belong'
	readonly ct = 'ct'
	readonly mt = 'mt'
}

const col = new Col

export class Row{
	static col = col;
	[col.id]?:int
	[col.belong]:str
	[col.ct]:int
	[col.mt]:int
}

export class WidCol extends Col{
	readonly wid='wid'
}
const widCol = new WidCol()
export class WidRow extends Row{
	static col = widCol;
	[widCol.wid]?:int
}

class WordCol extends Col{
	readonly text='text'
}
const wordCol = new WordCol()

export class WordRow extends Row{
	static col = wordCol;
	/** english, japanese, etc. */
	/** 詞形 */
	[wordCol.text]:str
	/** 增 新ʹ learnStatus行 或 property行 旹、視潙更改 */
}

class LearnCol extends WidCol{

}

export enum LearnBelong{
	/** add */
	add='add'
	/** remember */
	,rmb='rmb'
	/** forget */
	,fgt='fgt'
}

const learnCol = new LearnCol()

export class LearnRow extends WidRow{
	static col = learnCol;
	[learnCol.belong]:LearnBelong
}

class PropertyCol extends WidCol{
	readonly text='text'
}


export enum PropertyBelong{
	mean='mean'
	,tag='tag'
	,annotation='annotation'
	/** from what book, etc */
	,source='source'
	,pronounce='pronounce'
}

const propertyCol = new PropertyCol()

/** 單詞ʹ屬性 */
export class PropertyRow extends WidRow{
	static col = propertyCol;
	[propertyCol.text]:str
	[propertyCol.belong]:PropertyBelong
}

class RelationCol extends Col{
	readonly name='name'
}

export enum WordRelationBelong{
	/** 變體: 如 realize, realise  */
	variant='variant'
	/** 詞族: 如 realize, real, realization */
	,family='family'
}

const relationCol = new RelationCol()

export class RelationRow extends Row{
	static col = relationCol;
	[relationCol.name]:str
	[relationCol.belong]: WordRelationBelong
}

class WordRelationCol extends WidCol{
	readonly rid='rid'
}

const wordRelationCol = new WordRelationCol()

export class WordRelationRow extends WidRow{
	static col = wordRelationCol;
	[wordRelationCol.rid]:int
}
