// em++ wasm2.cc -o out/wasm2.js -s MODULARIZE=1 -s EXPORT_ES6=1
// node "D:\_code\voca\src\c\out\wasm2.js"
// em++ wasm2.cc -o out/wasm2.js -s MODULARIZE=1 -s EXPORT_ES6=1 && node "D:\_code\voca\src\c\out\wasm2.js"
// em++ wasm2.cc -o out/wasm2.js -s MODULARIZE=1 -s EXPORT_ES6=1 && node "d:\_code\voca\src\c\wasm2.js"
#include <emscripten.h>
//#include <isostream>
#include <stdio.h>
#define EXPORT EMSCRIPTEN_KEEPALIVE
#define EXTERN_C extern "C"
#define EXC extern "C" EMSCRIPTEN_KEEPALIVE

EXC double sub(double a, double b){
	return a-b;
}

extern "C"{
	EXPORT int test(){
		printf("hello");
		return 0;
	}
}

int main(){
	printf("123");
	return 0;
}

