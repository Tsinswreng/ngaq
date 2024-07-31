//@ts-check
// run_wasm.mjs
import { fileURLToPath } from 'url';
import path from 'path';
import * as Module from './build/ngaq.js'
import * as Ty from './type.ts'

async function Main(){
	//await Module.default();
	//console.log(await Module.default())
	console.log(Module)
	const def = await Module.default()
	console.log(def._main())
	// console.log(Object.keys(def))
	// const fn = def.cwrap('parse', 'string', ['string']);
	// const ans = fn('123')
	// console.log(ans)
}

Main();





// 动态导入 Emscripten 生成的模块
// const wasmPath = path.resolve('./build/wasm.js');
// const Module = await import(wasmPath);

// Module.default().then((module) => {
//     // 在 WebAssembly 模块加载完成后，调用 C++ 的 main 函数
//     module._main();
// }).catch((err) => {
//     console.error('Error loading module:', err);
// });

