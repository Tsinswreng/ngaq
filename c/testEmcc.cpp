// em++ testEmcc.cpp -o out/wasm.js -s MODULARIZE=1 -s EXPORT_ES6=1 -s "EXPORTED_RUNTIME_METHODS=['cwrap', 'setValue', 'getValue', 'AsciiToString']"
// em++ testEmcc.cpp -o out/wasm.js -s MODULARIZE=1 -s EXPORT_ES6=1 -s "EXPORTED_RUNTIME_METHODS=['cwrap', 'setValue', 'getValue', 'AsciiToString']" &&  node "d:\_code\voca\src\c\js\main.js"
#include <emscripten.h>
#define EXPORT EMSCRIPTEN_KEEPALIVE
#include <chrono>
#include <cmath>


namespace wasm{

long mills(){
	auto now = std::chrono::system_clock::now();

	// 将时间点转换为时间戳
	auto now_ms = std::chrono::time_point_cast<std::chrono::milliseconds>(now);

	// 获取时间戳的duration
	auto value = now_ms.time_since_epoch();

	// 将duration转换为毫秒数
	long duration = value.count();
	return duration;
}

struct E_N
{
	double e = 0;
	int n = -1;
};

}//namespace wasm

extern "C" {

	EXPORT const char* myFunction() {
		return "hello wasm";
	}

	EXPORT int add(int a, int b){
		return a+b;
	}

	EXPORT wasm::E_N* calcE(long duration){
		auto start = wasm::mills();
		auto timeToEnd = start + duration;
		double e = 0;
		wasm::E_N* ans = new wasm::E_N();
		for(long n = 0; ; n++){
			auto now = wasm::mills();
			if(now >= timeToEnd){
				break;
			}
			e=pow(
				(1.0+1.0/n)
				,n
			);
			ans->n = n;
			ans->e = e;
		}
		return ans;
	}
}
