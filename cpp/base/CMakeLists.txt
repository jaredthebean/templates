cmake_minimum_required(VERSION 4.0.3)
project(main)
add_executable(main.out main.cpp)
set_target_properties(main.out PROPERTIES
  # For our clang-tidy
  EXPORT_COMPILE_COMMANDS "ON"
  # Same reason + we are using clang so might as well keep things in the llvm family
  # By default the GNU std C++ lib is used even if we are using clang
  CXX_FLAGS "-stdlib=libc++"
  # So we can use std::format when needed
  CXX_STANDARD 20
)
