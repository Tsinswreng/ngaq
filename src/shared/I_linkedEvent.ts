/**
 * 鏈式事件。作潙I_Events中之成員。
 * @template Arg 觸發事件旹帶ʹ參
 */
export interface I_LinkedEvent<Arg extends any[] =any[]>{
	/** 名。在I_Events中唯一 */
	name:str
	/** 基。己觸發旹、基事件ˋ亦發 */
	base:I_LinkedEvent|undefined
}


/** 不效 */
type OnlyProperties<T> = {
    [K in keyof T]: T[K] extends Function ? any : T[K];
};

/**
 * 事件列表
 */
export interface I_Events{
	//[key:string]:OnlyProperties<I_LinkedEvent>
}



/**
 * 內部ʹ事件觸發器。事件類型潙字串或符號
 */
export interface I_EventEmitter{
	emit(eventName: string | symbol, ...args: any[]):unknown
	on(eventName: string | symbol, listener: (...args: any[]) => void): this;
}

export interface I_LinkedEmitter{
	emit<Arg extends any[] =any[]>(
		event: I_LinkedEvent<Arg>
		, ...args:Arg
	):int
}

export interface I_linkedEmittable{
	linkedEmitter:I_LinkedEmitter
	events:I_Events
}