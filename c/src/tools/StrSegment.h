#pragma once
#include "common.h"

namespace ngaq{

class StrSegment{
public:
	StrSegment(i32 start, i32 end, const string&& data)
		: start(start), end(end), data(std::move(data)) {}
	i32 start;
	i32 end;
	//data 是一个常量引用 (const std::string&)，它不拥有 std::string 对象的生命周期。这意味着 StrSegment 并不负责管理 std::string 对象的生命周期，因此不需要释放它。
	const string data;

	static std::vector<the<StrSegment>> split(const std::string& str, const std::string& sep);

};

}//~namespace ngaq