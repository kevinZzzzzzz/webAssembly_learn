#include <stdio.h>
#include <emscripten/emscripten.h>

int main()
{
  printf("Hello World\n");
  return 0;
}

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif
EXTERN EMSCRIPTEN_KEEPALIVE void greet(char *name)
{
  printf("Hello, %s!\n", name);
}

// Fibonacci function
EXTERN int EMSCRIPTEN_KEEPALIVE
fibonacci(int n)
{
  if (n <= 1)
  {
    return n;
  }
  else
  {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}