#include "common.h"
#include <iostream>
#include "lex.h"
//#include <nlohmann/json.hpp>
#include "nlohmann/json.hpp"
#include "models/WordModels.h"
#include "tools/StrSegment.h"

namespace ngaq{

class Test{
public:
	Test(int a, int b, std::string&& str)
		:a(a),b(b)
	{
		this->str = std::move(str);
	}
	int a;
	int b;
	std::string str;
};

int _20240808182442(){
	auto fn = [](){
		auto t = mkuq<Test>(1,2,"abc");
		auto t2 = mkuq<Test>(3,4,"def");
		auto v = vec<the<Test>>();
		v.push_back(mv(t));
		v.push_back(mv(t2));
		return v;
	};
	auto v = fn();
	for(auto& e : v){
		println(e->a);
		println(e->b);
		println(e->str);
	}
	return 0;
}

int _(){
	// string a = "z一𠂇||b😍0||abc";
	// auto ans = StrSegment::split(a, "||");
	// for(const auto& e : ans){
	// 	println(e->data);
	// 	println(e->start);
	// 	println(e->end);
	// }
	println(12>>1);
	return 0;
}

int _20240808181749(){
	auto fn = [](){
		auto str = string("012");
		auto&& sub = str.substr(1,2);
		auto t = mkuq<Test>(1,2,mv(sub));
		println(t->str);
		println("end lambda");
		return t;
	};
	auto t = fn();
	println(t->a);
	println(t->b);
	println(t->str);
	return 0;
}

// int _20240808160636(){

// 	string a = "abc||def||123||456";
// 	println(a);
// 	auto ans = ngaq::StrSegment::split(a, "||");
// 	for(auto& e : ans){
// 		println(e->data);
// 		println(e->start);
// 		println(e->end);
// 	}
// 	return 0;
// }

// int _20240808160422(){
// 	//std::unique_ptr<Test> t = std::make_unique<Test>(1,2,"abc");
// 	auto fn = [](){
// 		println("fn----");
// 		auto str = New<string>("abc");
// 		the<Test> t = mkuq<Test>(1,2,*(str));
// 		println(t->a);
// 		println(t->b);
// 		println(t->str);
// 		return t;
// 	};
// 	auto t = fn();
// 	println("end fn");
// 	println(t->a);
// 	println(t->b);
// 	println(t->str);

// 	return 0;
// }

// int _20240806115852(){ // -
// 	//the是unique_ptr; mkuq是make_unique; mv是move; vec是vector; println是输出函数;
// 	the<StrSegment> seg = mkuq<StrSegment>(0,2,"abc");
// 	println("data:",seg->data);
// 	println("start:",seg->start);
// 	println("end:",seg->end);
// 	return 0;
// }

// int _20240806115617(){ //ok
// 	StrSegment* seg = new StrSegment(0,2,"abc");
// 	println("data:",seg->data);
// 	println("start:",seg->start);
// 	println("end:",seg->end);
// 	delete seg;
// 	return 0;
// }

// int _20240806115450(){
// 	vec<the<StrSegment>> v;
// 	auto seg = mkuq<StrSegment>(0,2,"abc");
// 	println("data:",seg->data);
// 	v.push_back(mv(seg));
// 	println("size:", v.size());
// 	for(auto& e : v){
// 		println("123");
// 		println("data:",e->data);
// 		println("start:",e->start);
// 		println("end:",e->end);
// 	}
// 	println("456");
// 	return 0;
// }


}//~namespace ngaq

int main(){
	return ngaq::_();
}

int main20240804120039(){
	//ngaq::string a = "abc||def||z一𠂇||b😍0";
	using namespace ngaq;
	


	return 0;
}




extern "C"{
	EXPORT
	int add(int a, int b){
		return a + b;
	}
	EXPORT
	const char* concatStr(const char* a, const char* b){
		static std::string s = std::string(a) + std::string(b);
		return s.c_str();
	}
}
