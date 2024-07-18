export function randomIntArr(min:number, max:number, howMany:number, allowDuplicate=true){
	if(allowDuplicate===false){
		return non_duplicateInt(min, max, howMany)
	}else{
		return duplicateInt(min, max, howMany)
	}
	function duplicateInt(min:number, max:number, howMany:number){
		const result:number[] = []
		for(let i = 0; i < howMany; i++){
			let unusRandom = Number(max-min)* Math.random()+Number(min)
			result.push(Math.floor(unusRandom))
		}
		return result
	}
	/**
	 * GPT寫的
	 */
	function non_duplicateInt(min: number, max: number, howMany: number) {
		if (max - min + 1 < howMany) {
			throw new Error(`max - min + 1 < howMany`);
		}
		//创建一个包含从 min 到 max 的所有整数的数组。
		const integerArray = Array.from({ length: max - min + 1 }, (_, index) => index + min);
		for (let i = integerArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[integerArray[i], integerArray[j]] = [integerArray[j], integerArray[i]];
		}
		return integerArray.slice(0, howMany);
	}
}