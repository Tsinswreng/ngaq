cmake_minimum_required(VERSION 3.23)
project(voca)

set(CMAKE_CXX_STANDARD 14)
include_directories(lib) # 设置全局包含路径
add_executable(voca main.cpp)
