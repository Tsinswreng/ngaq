#pragma once
#include "common.h"

namespace ngaq{

using string = std::string;

string parse(const string src);

class Status{
	
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