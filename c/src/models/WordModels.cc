//#include "models/WordModels.h"
#include "models/WordModels.h"
#include "nlohmann/json.hpp"


namespace ngaq {


// void TextWord::to_json(nlohmann::json& j, const TextWord& p) {
// 	j = nlohmann::json{{"id", p.id}, {"belong", p.belong}, {"text", p.text}, {"ct", p.ct}, {"mt", p.mt}};
// }

// void TextWord::from_json(const nlohmann::json& j, TextWord& p) {
// 	j.at("id").get_to(p.id);
// 	j.at("belong").get_to(p.belong);
// 	j.at("text").get_to(p.text);
// 	j.at("ct").get_to(p.ct);
// 	j.at("mt").get_to(p.mt);
// }

}//~namespace ngaq