type uint64 = number

export class BlobWithText {

	static readonly HEADER_LEN = 8 //8字節

	static pack(text:str, binary:ArrayBuffer){
		const byteCount = new TextEncoder().encode(text).byteLength
		const ans = BlobWithText.new()
		ans.head = byteCount
		ans.arrBuf = binary
		ans.text = text
		return ans
	}

	static parse(data: ArrayBuffer){
		const len = this.HEADER_LEN
		const header = new Uint8Array(data.slice(0, len)); // 64 bits = 8 bytes
		const view = new DataView(header.buffer);
		const byteCount:uint64 = view.getUint8(0); // 從 header 的前 8 bytes 讀取 byteCount
		const stringData = new TextDecoder().decode(data.slice(len, len + byteCount));
		const binaryData = data.slice(len + byteCount);
		const pack = BlobWithText.new()
		pack.head = byteCount
		pack.text = stringData
		pack.arrBuf = binaryData
		return pack
	}

	static new(){
		const z = new this()
		return z
	}
	/** byteCount */
	head:uint64
	text:str
	arrBuf:ArrayBuffer

	toUint8Arr(){
		const z = this
		const head = new Uint8Array(8)
		const view = new DataView(head.buffer)
		view.setUint8(0, z.head)
		const concatenatedBuffer = new Uint8Array([
			...head
			, ...new TextEncoder().encode(z.text)
			, ...new Uint8Array(z.arrBuf)
		]);
		return concatenatedBuffer
	}
}

// import * as fs from 'fs'
// function saveDataPackage(dataPackage: DataPackage, filePath: string): void {
// 	const { byteCount, stringData, binaryData } = dataPackage;
// 	const header = new Uint8Array(8); // 64 bits = 8 bytes
// 	const view = new DataView(header.buffer);
// 	view.setUint8(0, byteCount); // 將 byteCount 寫入 header 的前 6 bytes
// 	const concatenatedBuffer = new Uint8Array([...header, ...new TextEncoder().encode(stringData), ...new Uint8Array(binaryData)]);
// 	fs.writeFileSync(filePath, concatenatedBuffer);
// }


// function decodeDataPackage(data: ArrayBuffer): DataPackage {
// 	const header = new Uint8Array(data.slice(0, 8)); // 64 bits = 8 bytes
// 	const view = new DataView(header.buffer);
// 	const byteCount = view.getUint8(0); // 從 header 的前 6 bytes 讀取 byteCount
// 	const stringData = new TextDecoder().decode(data.slice(8, 8 + byteCount));
// 	const binaryData = data.slice(8 + byteCount);
// 	return {
// 		byteCount,
// 		stringData,
// 		binaryData
// 	};
// }



// // 編碼部分

// interface DataPackage {
// 	byteCount: number;
// 	stringData: string;
// 	binaryData: ArrayBuffer;
// }

// function encodeDataPackage(stringData: string, binaryData: ArrayBuffer): DataPackage {
// 	const byteCount = new TextEncoder().encode(stringData).byteLength;
// 	return {
// 		byteCount,
// 		stringData,
// 		binaryData
// 	};
// }



// // 解碼部分

