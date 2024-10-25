#include <iostream>
#include <emscripten/bind.h>

using namespace emscripten;

class Communication
{
public:
  Communication()
  {
    std::cout << "Communication class created." << std::endl;
  }

  void executeCb()
  {
    std::cout << "这是 C++ 层的函数在 JS 层被调用" << std::endl;
  }

  void monitorCb(val cb, bool isExecute)
  {
    if (isExecute)
    {
      cb();
    }
  }
};

EMSCRIPTEN_BINDINGS(communication_module_bindings)
{
  class_<Communication>("Communication")
      .constructor<>()
      .function("executeCb", &Communication::executeCb)
      .function("monitorCb", &Communication::monitorCb);
}
