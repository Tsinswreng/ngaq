#pragma once

#include <functional>
#include <list>
#include <map>
#include <memory>
#include <set>
#include <string>
#include <utility>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>

#include <emscripten.h>
#define EXPORT EMSCRIPTEN_KEEPALIVE
// #ifdef __EMSCRIPTEN__
// 	#include <emscripten.h>
// 	#define EXPORT EMSCRIPTEN_KEEPALIVE
// #elif defined(_WIN32) || defined(__CYGWIN__)
// 	#define EXPORT __declspec(dllexport)
// #else
// 	#define EXPORT
// #endif


namespace ngaq{

template <class T>
using the = std::unique_ptr<T>;
template <class T>
using an = std::shared_ptr<T>;
template <class T>
using of = an<T>;
template <class T>
using weak = std::weak_ptr<T>;

/**
 * 智能指針Y轉X
 */
template <class X, class Y>
inline an<X> As(const an<Y>& ptr) {
	return std::dynamic_pointer_cast<X>(ptr);
}

template <class X, class Y>
inline bool Is(const an<Y>& ptr) {
	return bool(As<X, Y>(ptr));
}

template <class T, class... Args>
inline an<T> New(Args&&... args) { // 参数包 Args 使用双引用符号 && 进行声明，这是一种参数包展开技术，可以将参数包中的参数逐个展开。
	return std::make_shared<T>(std::forward<Args>(args)...);//完美转发是指将参数的类型和值原封不动地传递给函数内部，避免不必要的复制和移动操作。
}

}//~namespace ngaq




