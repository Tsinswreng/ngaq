import type * as Ty from '@shared/Type'

/**
 * 判空後返回
 * @param v 
 * @param err 
 * @returns 
 */
export function $<T>(v:T, err:string|Error=''): NonNullable<T>{
	if(v == null){
		if(typeof err === 'string'){
			throw new Error(err)
		}else{
			throw err
		}
	}
	return v as NonNullable<T>
}

/**
 * nonNullable Array
 * 數組或字符串判空後返回。
 * @param v 
 * @param err 
 * @returns 
 */
export function $a<T>(v:T[]|undefined|null, err?:string|Error):T[]
export function $a<T>(v:string|undefined|null, err?:string|Error):string

export function $a<T>(v:T[]|string|undefined|null, err:string|Error=''){
	if(v == null || v.length === 0){
		if(typeof err === 'string'){
			throw new Error(err)
		}else{
			throw err
		}
	}
	return v
}


/**
 * 實例ᵗ類型轉化 並檢查
 * class Child extends Father{}
 * let idk:any = new Child()
 * let c = instanceAs(idk, Father) //c:Father ok
 * @param src 源實例
 * @param TargetClass 目標類
 * @param errMsg 若潙null則返null、不拋錯
 * @returns 
 */

export function instanceAs<Target extends { prototype: any }>
	(src, TargetClass: Target, errMsg:null)
	: Ty.InstanceType_<Target>|null

export function instanceAs<Target extends { prototype: any }>
	(src, TargetClass: Target, errMsg?:any)
	: Ty.InstanceType_<Target>

export function instanceAs<Target extends { prototype: any }>(src, TargetClass: Target, errMsg:any=''){
	if(TargetClass?.constructor == void 0){
		if( typeof errMsg === 'string' ){
			throw new Error(errMsg)
		}else{
			throw errMsg
		}
	}
	//@ts-ignore
	if(src instanceof TargetClass){
		return src as Ty.InstanceType_<Target>
	}else{
		if( typeof errMsg === 'string' ){
			throw new Error(errMsg)
		}else if(errMsg === null){
			return null
		}else{
			throw errMsg
		}
	}
}



/**
 * 基本數據類型 類型斷言 帶運行時檢查
 * let a:any = 1
 * let b = primitiveAs(a, 'number') //b:number
 * 
 * @param src 
 * @param target 
 * @param errMsg 若傳入null則返回null、不拋錯誤
 * @returns 
 */
export function primitiveAs<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg:null)
	:null|Ty.ParseType<Target>

export function primitiveAs<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg?:any)
	:Ty.ParseType<Target>
export function primitiveAs<Target extends string>(src, target:Ty.PrimitiveTypeStr|Target, errMsg:any=''){
	if(typeof src === target){
		return src as Ty.ParseType<Target>
	}else{
		if( typeof errMsg === 'string'){
			throw new Error(errMsg)
		}else if(errMsg === null){
			return null
		}else{
			throw errMsg
		}
	}
}



// /** primitiveAs */
// export function As<Target extends jstype>(src, target:Target, errMsg?:any):Ty.ParseType<Target>

// /** instanceAs */
// export function As<Target extends { prototype: any }>(src, target:Target, errMsg?:any):Ty.InstanceType_<Target>


/** instanceAs */
export function As<Target extends { prototype: any }>
	(src, TargetClass: Target, errMsg:null)
	: Ty.InstanceType_<Target>|null
/** instanceAs */
export function As<Target extends { prototype: any }>
	(src, TargetClass: Target, errMsg?:any)
	: Ty.InstanceType_<Target>

/** primitiveAs */
export function As<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg:null)
	: Ty.ParseType<Target>|null

/** primitiveAs */
export function As<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg?:any)
	: Ty.ParseType<Target>

/**
 * 
 * @param src 
 * @param target 
 * @param errMsg 若傳入null則返回null、不拋錯誤
 * @returns 
 */
export function As<Target extends string|{ prototype: any }>(src, target:Target, errMsg:any=''){
	if(typeof target === 'string'){
		return primitiveAs(src, target, errMsg)
	}else{
		return instanceAs(src, target, errMsg)
	}
}

/** instanceassert */
export function asrt<Target extends { prototype: any }>
	(src, TargetClasserts: Target, errMsg:null)
	: asserts src is Ty.InstanceType_<Target>|null
/** instanceassert */
export function asrt<Target extends { prototype: any }>
	(src, TargetClasserts: Target, errMsg?:any)
	: asserts src is Ty.InstanceType_<Target>

/** primitiveassert */
export function asrt<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg:null)
	: asserts src is Ty.ParseType<Target>|null

/** primitiveassert */
export function asrt<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg?:any)
	: asserts src is Ty.ParseType<Target>

export function asrt<Target extends string|{ prototype: any }>(src, target:Target, errMsg:any=''){
	if(typeof target === 'string'){
		return primitiveAs(src, target, errMsg)
	}else{
		return instanceAs(src, target, errMsg)
	}
}

