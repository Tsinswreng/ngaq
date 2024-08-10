#pragma once

//In included file: target of using declaration conflicts with declaration already in scopeclang(using_decl_conflict)
#include <memory>

#include <functional>
#include <list>
#include <map>
#include <set>
#include <string>
#include <utility>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>

// In included file: "Including files directly from the emscripten source tree is not supported.
// Please use the cache/sysroot/include directory".clang(pp_hash_error)
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


#include <iostream>
template<typename ...T>
inline void println(T ...v){
	//std::cout << v << std::endl;
	(std::cout << ... << v) << std::endl; // 折叠表达式
}

inline void println(){
	std::cout << std::endl;
}


namespace ngaq{

template <class T>
using the = std::unique_ptr<T>;
template <class T>
using an = std::shared_ptr<T>;
template <class T>
using of = an<T>;
template <class T>
using weak = std::weak_ptr<T>;
using i64 = long long;
using i32 = int;
using f64 = double;
using string = std::string;

template <class T>
using vec = std::vector<T>;

// template <typename... Args>
// auto mkuq(Args&&... args) -> decltype(std::make_unique(std::forward<Args>(args)...)) {
// 	return std::make_unique(std::forward<Args>(args)...);
// }



// 自定义的 make_unique 函数
// template<typename T, typename... Args>
// inline std::unique_ptr<T> mkuq(Args&&... args) {
// 	return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
// }



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

template <class T, class... Args>
inline the<T> mkuq(Args&&... args) { // 参数包 Args 使用双引用符号 && 进行声明，这是一种参数包展开技术，可以将参数包中的参数逐个展开。
	return std::make_unique<T>(std::forward<Args>(args)...);//完美转发是指将参数的类型和值原封不动地传递给函数内部，避免不必要的复制和移动操作。
}

template <class T>
inline auto mv(T&& v){
	return std::move(v);
}



}//~namespace ngaq




