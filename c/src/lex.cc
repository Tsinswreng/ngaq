#include "common.h"
#include "lex.h"

namespace ngaq{

string parse(string src){
	return "____"+src;
}



}//~namespace ngaq




extern "C"{
	EXPORT
	const char* parse(const char* src){
		//使用 static 变量是为了确保返回的字符串在函数返回后仍然有效。请注意，这样做意味着每次调用 parse 函数时都将覆盖之前的结果。如果需要存储多个结果，可能需要使用其他机制（例如，线程本地存储或动态内存分配）。
		static std::string result = ngaq::parse(src);
		return result.c_str(); // 返回 C 风格的字符串
	}
}

