#include <iostream>

extern "C"
{
  // 递归方式计算斐波那契数列的第n个数
  int fibonacci(int n)
  {
    if (n <= 1)
      return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}

// int main()
// {
//   int n;
//   std::cout << "请输入斐波那契数列的项数：";
//   std::cin >> n;

//   std::cout << fibonacci(n);

//   return 0;
// }
