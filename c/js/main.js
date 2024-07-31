//@ts-check

// // loader.mjs
import { readFileSync } from 'fs';
import wasmM from '../out/wasm.js'

function getENValues(structPointer) {
    // WebAssembly 内存视图
    const memory = new DataView(instance.HEAP8.buffer);

    // 假设 WebAssembly 中 double 是 8 字节，long 是 4 字节或 8 字节（根据具体平台）
    // 假设 long 在 WebAssembly 环境中是 4 字节 (32-bit)
    const doubleSize = 8;
    const longSize = 4; // 或 8，如果是 64-bit long

    // 读取结构体成员
    const e = memory.getFloat64(structPointer, true); // 获取 double 成员
    const n = memory.getInt32(structPointer + doubleSize, true); // 获取 long 成员，如果是 64-bit，则使用 getBigInt64

    return [e, n];
}

async function main(){
	const inst = await wasmM()
	for(const key in inst){
		console.log(key)
	}

	const ans = inst._calcE(1000)
	console.log(getENValues(ans))
}

//main()

wasmM().then(instance => {
    // 获取 WebAssembly 导出函数
    const { _calcE, E_N } = instance;

    // 调用 WebAssembly 导出函数

    
    // 传递参数给 calcE 函数，并获取返回的结构体指针
    const duration = 2000; // 传递给 calcE 函数的参数
    const structPointer = _calcE(duration);

    // 从结构体指针中获取结构体的两个成员
    const memory = new DataView(instance.HEAP8.buffer);
    const e = memory.getFloat64(structPointer, true); // 结构体中 e 成员的偏移量为 8
    const n = memory.getInt32(structPointer+8, true); // 结构体中 n 成员的偏移量为 16
    
    console.log(`e: ${e}, n: ${n}`);
}).catch(err => {
    console.error('Failed to load WebAssembly module:', err);
});

// wasmM().then(instance => {
// 	// 获取 WebAssembly 导出函数
// 	const getStructInstance = instance.cwrap('calcE', 'number', [1000]);
  
// 	/**
// 	 * 从给定的结构体指针中提取 e 和 n 成员
// 	 * @param {number} structPointer - 结构体实例的指针
// 	 * @returns {[number, number]} 包含 e 和 n 的数组
// 	 */
// 	function getENValues(structPointer) {
// 	  // WebAssembly 内存视图
// 	  const memory = new DataView(instance.HEAP8.buffer);
  
// 	  // 假设 WebAssembly 中 double 是 8 字节，long 是 4 字节或 8 字节（根据具体平台）
// 	  // 假设 long 在 WebAssembly 环境中是 4 字节 (32-bit)
// 	  const doubleSize = 8;
// 	  const longSize = 4; // 或 8，如果是 64-bit long
  
// 	  // 读取结构体成员
// 	  const e = memory.getFloat64(structPointer, true); // 获取 double 成员
// 	  const n = memory.getInt32(structPointer + doubleSize, true); // 获取 long 成员，如果是 64-bit，则使用 getBigInt64
  
// 	  return [e, n];
// 	}
  
// 	// 示例调用
// 	const structPointer = getStructInstance();
// 	const [e, n] = getENValues(structPointer);
// 	console.log(`e: ${e}, n: ${n}`);
//   }).catch(err => {
// 	console.error('Failed to load WebAssembly module:', err);
// });



const sp = {
	env: {
	  memoryBase: 0,
	  tableBase: 0,
	  memory: new WebAssembly.Memory({
		initial: 256
	  }),
	  table: new WebAssembly.Table({
		initial: 0,
		element: 'anyfunc'
	  })
	},
	imports: {
	  imported_func: arg => {
		console.log(arg);
	  }
	}
  }

// 定义函数以处理返回的 E_N 对象
function handleResult(e_n_ptr) {
    // 通过指针访问 E_N 对象的成员
    const e = Module.getValue(e_n_ptr + 8, 'double'); // 偏移 8 字节获取 e 的值
    const n = Module.getValue(e_n_ptr + 16, 'i64');    // 偏移 16 字节获取 n 的值

    // 打印结果
    // console.log('e:', e);
    // console.log('n:', n);
	return [e,n]

    // 释放内存
    Module._free(e_n_ptr);
}

const main2 = (async () => {
	// 加載 Wasm 模塊
	const wasmCode = readFileSync('D:/_code/voca/src/c/out/wasm.wasm')
	
	//const wasmModule = new WebAssembly.Module(wasmCode);
	
	// 實例化 Wasm 模塊
	//const instance = await WebAssembly.instantiate(wasmModule, {});
	const instance = await WebAssembly.instantiate(wasmCode, sp)

	// 調用 Wasm 模塊的函數
	const result = instance.exports;
	
	// 打印結果
	//console.log(result.add(3,4));
	const e_n_ptr = result.calcE(1000)
	
})



