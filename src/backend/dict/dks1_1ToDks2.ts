// import * as fs from 'fs'
// console.log(process.argv)
// const path = process.argv[2];

// const txt = fs.readFileSync(path, 'utf8')

// const lines = txt.split('\n')


// function parseLine(line: string): string {
// 	const cols = line.split('\t')
// 	let c1 = cols[1]
// 	if(!c1.startsWith('!')) {
// 		return line
// 	}
// 	if(/!.../.test(c1)){
// 		c1 = c1.replace(/(.*)q/g, '$1u')
// 		c1 = c1.replace(/(.*)a/g, '$1j')
// 		c1 = c1.replace(/(.*)z/g, '$1m')
// 		cols[1] = c1
// 		return cols.join('\t')
// 	}

// 	if(/!....../.test(c1)){
// 		c1 = c1.replace(/(.*)q/g, '$1u')
// 		c1 = c1.replace(/(.*)a/g, '$1j')
// 		c1 = c1.replace(/(.*)z/g, '$1m')
// 		cols[1] = c1
// 		return cols.join('\t')
// 	}
	
// }