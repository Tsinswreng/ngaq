//import { Priority } from "@shared/SingleWord2"
import { Priority } from "@shared/entities/Word/Word"
type Conf0 = typeof Priority.defaultConfig
type Fn<Return=any> = <Return=any>(...args:any[])=>Return
interface I_WordPriority{
	/** 此配置項之名 */
	name:string
	/** 在哪些單詞表起效。若潙undefined則皆起效 */
	includeTables?:string[]
	/** 在哪些單詞表不起效 */
	excludeTables?:string[]
	/** 權重參數 */
	//params:Partial<Conf0>
	/** 過濾函數。true:保留、false:濾除。在算權重前過濾 */
	filterBefore?:(...args:any[])=>boolean
	/** 
	 * 㕥計算權重之函數數組
	 * 執行順序:先蔿每個單詞對象執行此數組中之首個函數、然後纔蔿每個單詞對象執行數組中之下一個函數。如是則可叶功能芝 把第一輪權重計算中所得均值傳入後續函數中作參數等。
	 */
	calcPrioFnArr?:(Fn)[]
	/** 計算最後權重 */
	calcFinPrioFn?:(Fn<number>)
	/** 過濾函數。true:保留、false:濾除。在算權重前過濾 */
	filterAfter?:(...args:any[])=>boolean

}

class PriorityConfig implements I_WordPriority{
	name=''
	includeTables= []
	params:Partial<Conf0>={}
	filterBefore?:(...args:any[])=>boolean
	calcPrioFnArr?: Fn<any>[] | undefined;

}

/*
模式一 二 三
指定配置文件路径
自ᵈ叶ᵣ算法代碼
*/

/* 
定義一個默認算法類
每張詞表定義一個算法實現
建 VocaTableManager、焉ʸ存各詞表ᵗ權重算法

id	表名	權重算法代碼(js)


設每64個詞一組、允 自訂 每組中 各表ᙆᵗ詞ᵗ比例。如日:英 = 40:24
允 權重初分配 與 再分配
權重變化ᵗ視圖

元數據表 名稱固定 _metadata、禁 用戶詞表 佔用此名
事件響應 分 前與後。如建表前與建表後。建表前 響應事件旹 允 攔截操作。如檢查表名、修改sql等。
*/
