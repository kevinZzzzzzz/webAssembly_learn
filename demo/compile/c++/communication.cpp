#include <emscripten.h>
#include <emscripten/bind.h>

class Communication
{
public:
  void executeCb()
  {
    EM_ASM_({
      console.log('这是 C++ 层的函数在 js 层被调用,且在 C++ 内嵌套 js 代码');
    });
  }

  void monitorCb(emscripten::val cb, bool isExecute)
  {
    if (isExecute)
    {
      cb();
    };
  }
};

EMSCRIPTEN_BINDINGS(communication_module_bindings)
{
  emscripten::class_<Communication>("Communication")
      .constructor<>()
      .function("executeCb", &Communication::executeCb)
      .function("monitorCb", &Communication::monitorCb);
}
