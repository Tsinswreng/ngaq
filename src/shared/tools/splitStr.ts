import type { I_Segment } from "@shared/interfaces/I_Parse"
export class StrSegment implements I_Segment<str>{

	protected constructor(){}
	protected __init__(...args: Parameters<typeof StrSegment.new>){
		const z = this
		z.start = args[0]
		z.end = args[1]
		z.data = args[2]
		return z
	}

	static new(start:int, end:int, data:str){
		const z = new this()
		z.__init__(start, end, data)
		return z
	}

	/** included */
	start: number
	/** included */
	end: number
	data: string
}

/**
 * fn(`abc||de||fgh`, `||`) ->
 * SplitResult{start: 0, end:2, text:'abc'} ... (共三個)
 * @param str 
 * @param sep 
 */
export function splitStr(str:str, sep:str):StrSegment[]{
	if(sep.length === 0){
		throw new RangeError(`sep cannot be an empty string`)
	}
	const segments: StrSegment[] = [];
	let start = 0;
	let end = str.indexOf(sep);

	while (end !== -1) {
		const segment = StrSegment.new(start, end - 1, str.slice(start, end));
		segments.push(segment);
		start = end + sep.length;
		end = str.indexOf(sep, start);
	}

	if (start < str.length) {
		const segment = StrSegment.new(start, str.length - 1, str.slice(start));
		segments.push(segment);
	}

	return segments;
}