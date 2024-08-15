#include "common.h"

namespace ngaq{

struct InMills{
	const i64 SEC = 1000;
	const i64 MIN = 60 * SEC;
	const i64 HOUR = 60 * MIN;
	const i64 DAY = 24 * HOUR;
};

static auto inMills = InMills{};

class EventCalcer{

};

} //~namespace ngaq

