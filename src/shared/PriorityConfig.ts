//
import { Priority } from "./SingleWord2"
type Conf0 = typeof Priority.defaultConfig
class PriorityConfig{
	name=''
	effectedTables= []
	config:Partial<Conf0>={

	}
	filter?:(...args:any[])=>boolean
	calcPrio?:(...args:any[])=>number
}

/*
模式一 二 三
指定配置文件路径
自ᵈ叶ᵣ算法代碼
*/

