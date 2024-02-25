
export default class ArrayDeque<T>{
	protected constructor(){
		
	}

	static new<T>(capacity:number){
		const o = new this<T>()
		o._capacity = capacity
		return o
	}

	protected _data = [] as T[]
	
	protected _size:number = 0
	get size(){return this._size}

	protected _capacity:number = 0
	get capacity(){return this._capacity}

	protected _reversed = false
	protected _frontI = 0 // 當_reversed潙true旹、_frontI實潙隊尾
	protected _backI = 0
	

	get front(){return this._data[this._frontI]}
	get back(){return this._data[this._backI]}

	isEmpty(){
		return this.size === 0
	}

	isFull(){
		return this._size === this._capacity
	}

	clear(){
		this._data = []
		this._size = 0
		this._frontI = 0
		this._backI = 0
	}

	reverse(){
		// const temp = this._frontI
		// this._frontI = this._backI
		// this._backI = temp
		let t
		t = this.frontIterFn.bind(this)
		this.frontIterFn = this.backIterFn.bind(this)
		this.backIterFn = t

		t = this.addFront.bind(this)
		this.addFront = this.addBack.bind(this)
		this.addBack = t

		t = this.removeFront.bind(this)
		this.removeFront = this.removeBack.bind(this)
		this.removeBack = t
		this._reversed = !this._reversed
	}

	addBack(ele:T){
		if(this.isFull()){
			return false
		}
		if(this.isEmpty()){
			this._data[this._backI] = ele
		}else{
			this._backI = (this._backI+1)%this.capacity
			this._data[this._backI] = ele
		}
		this._size += 1
		return true
	}

	removeBack(){
		if(this.isEmpty()){
			return void 0
		}
		const t = this.back
		delete this._data[this._backI]
		this._size -= 1
		this._backI = this._backI-1
		if(this._backI < 0){this._backI+=this._capacity}
		return t
	}

	addFront(ele:T){
		if(this.isFull()){
			return false
		}
		if(this.isEmpty()){
			
		}else{
			this._frontI = this._frontI-1
			if(this._frontI < 0){this._frontI+=this._capacity}
			this._data[this._frontI] = ele
		}
		this._size += 1
		return true
	}

	removeFront(){
		if(this.isEmpty()){
			return void 0
		}
		const t = this.front
		delete this._data[this._frontI]
		this._frontI = (this._frontI+1)%this.capacity
		this._size -= 1
		return t
	}

	expand(neoCapacity:number){
		if (neoCapacity <= this.size){
			return false
		}
		const neoData = new Array<T>(neoCapacity)
		for(let i = 0; i < this.size; i++){
			neoData[i] = this._data[i]
		}
		//delete this._data
		this._data = neoData
		this._capacity = neoCapacity
		return true
	}

	/**
	 * usage:
	 * const fi = deque.frontIterFn()
	 * for(let i = 0; i < deque.size; i++){
	 * 	console.log(fi())
	 * }
	 */
	frontIterFn(){
		let i = this._frontI
		//let cnt = 0
		return ()=>{
			const t = this._data[i]
			i = (i+1)%this.capacity
			//cnt++
			return t
		}
	}

	backIterFn(){
		let i = this._backI
		//let cnt = 0
		return ()=>{
			const t = this._data[i]
			i = (i-1)
			if(i<0){i+=this.capacity}
			//cnt++
			return t
		}
	}

}



// protected frontIterClass(){
		
// 	class DequeFrontIter<T> implements I_Iter<T>{
// 		protected _deque:Deque<T> = undefined as unknown as Deque<T>
// 		protected constructor(/* _deque:Deque<T> */){
// 			//this._deque = _deque
// 		}
// 		static new<T>(deque:Deque<T>, start:number){
// 			const o = new this<T>()
// 			o._pos = start
// 			return o
// 		}

// 		protected _cnt = 0
// 		protected _pos = undefined as unknown as number

// 		current(): T {
// 			return this._deque._data[this._pos]
// 		}
// 		next(): T {
// 			const data = this.current()
// 			this._pos = (this._pos+1)%this._deque._capacity
// 			this._cnt += 1
// 			return data
// 		}
// 		hasNext(): boolean {
// 			if(this._cnt === this._deque._size){
// 				return false
// 			}
// 			return true
// 		}
// 		rewind() {
// 			throw new Error("Method not implemented.")
// 		}
// 		count(): number {
// 			return this._cnt
// 		}

		
// 	}

// }

interface I_Iter<T>{
	current():T
	next():T
	hasNext():boolean
	rewind()
	count():number
}



// let a:number|undefined = 0
// let b:string|null = ''
// function aa(){
// 	let c = a??b
// }
