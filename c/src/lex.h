#pragma once
#include "common.h"

namespace ngaq{

using string = std::string;

string parse(const string src);

struct Status{
	i32 pos = 0;
	
};



class Lex{
public:
	Lex(const string& src);


};


}//~namespace ngaq

extern "C"{
	EXPORT
	const char* parse(const char* src);
}