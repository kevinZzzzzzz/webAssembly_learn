#include <stdio.h>
#include <emscripten/emscripten.h>

int main(int argc, char **argv)
{
  printf("导入CFun代码成功！！！\n");
  return 0;
}
// emcc fun.c -o ./CFun.js -g1 -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s 'EXPORT_NAME="CFun"' -s "EXPORTED_RUNTIME_METHODS=['ccall','cwrap']" -s 'ENVIRONMENT="web"'
#ifdef __cplusplus
extern "C"
{
#endif

  int EMSCRIPTEN_KEEPALIVE add(int a, int b)
  {
    return a + b;
  }
  int EMSCRIPTEN_KEEPALIVE subtract(int a, int b)
  {
    return a - b;
  }
  int EMSCRIPTEN_KEEPALIVE multiply(int a, int b)
  {
    return a * b;
  }
  float EMSCRIPTEN_KEEPALIVE divide(int a, int b)
  {
    return (float)a / b;
  }

#ifdef __cplusplus
}
#endif