#include "common.h"
#include "tools/StrSegment.h"


namespace ngaq{

/**
 * 只処理字節、不按unicode碼點
 */
std::vector<the<StrSegment>> StrSegment::split(const std::string& str, const std::string& sep) {
	if (sep.empty()) {
		throw std::range_error("sep cannot be an empty string");
	}

	std::vector<the<StrSegment>> ans;
	i32 start = 0;
	i32 end = str.find(sep);

	for(int i = 0; end != std::string::npos; i++) {
		string&& data = str.substr(start, end - start);
		//auto seg = StrSegment(start, end - 1, data);
		auto seg = std::make_unique<StrSegment>(start, end - 1, mv(data));
		ans.push_back(
			std::move(seg)
		);
		start = end + sep.length();
		end = str.find(sep, start);
	}

	if (start < str.length()) {
		ans.push_back(
			std::make_unique<StrSegment>(start, str.length() - 1, str.substr(start))
		);
	}
	return ans;
}

}//~namespace ngaq


