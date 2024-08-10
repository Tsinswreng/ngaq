import { I_Row, I_IdBlCtMtRow } from "./I_Entity"

/* 
㕥約束 取出ʹ實體ʹ接口
程序對象實例
表結構ʹ訊、各列ʹ列名
建表sql
建觸發器及索引sql
封裝ʹsql操作
*/


export class BaseRow implements I_Row{

}

export class IdBlCtMtRow implements I_IdBlCtMtRow{
	id:int
	bl:str = ''
	ct:int
	mt:int
}


