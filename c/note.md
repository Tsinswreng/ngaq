
## jsˋ 由ᵣ em++ ʃ生ʹ wasmˇ 調c++

```cpp
#include"common.h"
extern "C"{
	EXPORT //修飾符 、編譯後保留此函數
	const char* concatStr(const char* a, const char* b){
		// > //使用 static 变量是为了确保返回的字符串在函数返回后仍然有效。请注意，这样做意味着每次调用 parse 函数时都将覆盖之前的结果。如果需要存储多个结果，可能需要使用其他机制（例如，线程本地存储或动态内存分配）。
		// 若刪static 則函數彈棧後 內容則消、s.c_str()ʃ返ˋ成懸空指針。
		static std::string s = std::string(a) + std::string(b);
		return s.c_str();
	}
}

```

```ts
//編譯器生成ʹjs
import * as Module from './build/ngaq.js'

async function Main(){
	const def = await Module.default() //會調用main函數
	//console.log(def._main())
	// console.log(Object.keys(def))
	/**
	 * c函數名:str(不必加_于前), 返值:str, 入參:str[]
	 */
	const fn = def.cwrap('concatStr', 'string', ['string', 'string']);
	const ans = fn('123', '456')
	console.log(ans) // > 123456
}

Main();

```

