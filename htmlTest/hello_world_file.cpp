#include <stdio.h>

int main()
{
  FILE *file = fopen("./helloWorld.txt", "rb");
  if (!file)
  {
    printf("cannot open file\n");
    return 1;
  }
  while (!feof(file))
  {
    char c = fgetc(file);
    if (c != EOF)
    {
      putchar(c);
    }
  }
  fclose(file);

  printf("\n");

  return 0;
}
