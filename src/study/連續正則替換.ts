/* class ContinuousRegExp{
	public static replace(srcStr:string, left:string[], right:string[]):string{
		if(left.length !== right.length){
			throw new Error('left.length !== right.length');
		}
		let newStr = srcStr + ''
		for(let i = 0; i < left.length; i++){
			let regex = new RegExp(left[i])
			newStr = srcStr.replace(regex, right[i])
		}
		return newStr
	}
}

function t20230618094140(){
	const fs = require('fs')
	const oldFile = fs.readFileSync('old.txt', 'utf-8')
	const newStr = ContinuousRegExp.replace(oldFile,)

}

t20230618094140() */