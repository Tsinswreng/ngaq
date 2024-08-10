function colorize(text: string, color: string): string {
	const colors: { [key: string]: string } = {
		reset: "\x1b[0m",
		red: "\x1b[31m",
		green: "\x1b[32m",
		yellow: "\x1b[33m",
		blue: "\x1b[34m",
		magenta: "\x1b[35m",
		cyan: "\x1b[36m",
		white: "\x1b[37m",
		gray: "\x1b[90m",
	};
	return colors[color] + text + colors.reset;
}

function customInspect(obj: any, depth: number = 2, currentDepth: number = 0): string {
	// 基本類型處理
	if (obj === null) return colorize('null', 'red');
	if (typeof obj === 'undefined') return colorize('undefined', 'gray');
	if (typeof obj === 'string') return colorize(`"${obj}"`, 'green');
	if (typeof obj === 'number') return colorize(String(obj), 'blue');
	if (typeof obj === 'boolean') return colorize(String(obj), 'yellow');

	// 限制深度
	if (currentDepth >= depth) return colorize('...', 'magenta');

	// 處理數組
	if (Array.isArray(obj)) {
		const items = obj.map(item => customInspect(item, depth, currentDepth + 1));
		return colorize(`[${items.join(', ')}]`, 'cyan');
	}

	// 處理對象
	if (typeof obj === 'object') {
		const keys = Object.keys(obj);
		const properties = keys.map(key => {
			const value = customInspect(obj[key], depth, currentDepth + 1);
			return colorize(`${key}: ${value}`, 'white');
		});
		return colorize(`{ ${properties.join(', ')} }`, 'cyan');
	}

	// 處理其他情況
	return String(obj);
}

// 示例用法
const exampleObject = {
	name: 'Alice',
	age: 30,
	hobbies: ['reading', 'gaming'],
	address: {
		city: 'Wonderland',
		zip: '12345'
	}
};

//console.log(customInspect(exampleObject, 2));


