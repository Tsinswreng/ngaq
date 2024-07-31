#include "common.h"
#include <string>
#include "nlohmann/json.hpp"

namespace ngaq {

class TextWord{
public:
	std::string id;
	std::string belong;
	std::string text;
	i64 ct;
	i64 mt;

	// 序列化
	friend void to_json(nlohmann::json& j, const TextWord& p);

	// 反序列化
	friend void from_json(const nlohmann::json& j, TextWord& p);
};

}//~namespace ngaq

