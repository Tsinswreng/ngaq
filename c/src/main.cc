#include <iostream>
#include "lex.h"
//#include <nlohmann/json.hpp>
#include "nlohmann/json.hpp"
#include "models/WordModels.h"


int main(){
	ngaq::TextWord tw;
	nlohmann::json j;
	
	std::cout << j.dump(4) << std::endl;
	std::cout<<tw.id<<::std::endl;
	std::cout<<"123"<<std::endl;;
	
	return 0;
}

int main2(){
	// 创建一个 JSON 对象
	nlohmann::json j;
	
	j["name"] = "John";
	j["age"] = 30;
	// 打印 JSON 对象
	//std::cout << j.dump(4) << std::endl; // 格式化输出
	auto ans = j.dump(4);
	
	std::cout << j << std::endl;

	return 0;
}

int main1(){
	auto ans = ngaq::parse("ngaq");
	std::cout << "start" << std::endl;
	std::cout << ans << std::endl;
	std::cout << "done" << std::endl;
	return 0;
}


extern "C"{
	EXPORT
	int add(int a, int b){
		return a + b;
	}
}
