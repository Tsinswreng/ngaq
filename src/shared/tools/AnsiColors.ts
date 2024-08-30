export enum AnsiColors {

	
	
}

// 256 色支持
export function color256(fg: number, bg: number = -1): string {
	const fgCode = `\x1b[38;5;${fg}m`;
	const bgCode = bg >= 0 ? `\x1b[48;5;${bg}m` : '';
	return `${fgCode}${bgCode}`;
}

// 真彩色支持
export function rgbColor(r: number, g: number, b: number, bg: boolean = false): string {
	const colorCode = bg ? `\x1b[48;2;${r};${g};${b}m` : `\x1b[38;2;${r};${g};${b}m`;
	return colorCode;
}

