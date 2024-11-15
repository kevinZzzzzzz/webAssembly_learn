## 安装

```
  git clone https://github.com/juj/emsdk.git
  cd emsdk
  ./emsdk install latest
  ./emsdk activate latest
  source ./emsdk_env.sh  #注册环境变量
  emcc -v  #查看版本
```

## 编译

```
webAssembly-react\C
e.g
  emcc fun.c -o ./CFun.js -g1 -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s 'EXPORT_NAME="CFun"' -s "EXPORTED_RUNTIME_METHODS=['ccall','cwrap']" -s 'ENVIRONMENT="web"
```

解释：

- WASM=1 :表示生成 wasm 格式文件而不是 asm 格式文件，目前新版本默认就是 wasm
- EXIT_RUNTIME=1:编译出的 wasm 默认情况下不会退出运行的，这是 web 情况下期待的方式，主程序 main 虽然运行结束了，但模块没有退出，静态变量可以保持在内存中，不释放。同时标准 I/O 缓冲区没有被 flush，加此参数则能让模块结束，才能看到 I/O 输出，否则无法看到 printf 的输出
- o:输出文件格式
- O:是用来指定优化级别，优化级别有 -O0, -O1, -O2, -O3 -Os 这五种级别。不指定是为 -O0, 即没有优化，开发时一般指定为 -O0 或 -O1， 这样编译速度快，调试方便。 正式发布时可以是 -O2 或 -O3，这时代码会优化，执行更快。-Os 不光是执行快，同时优化大小，可生成更小的执行文件。执行后目录下会生成 hello.html hello.js 和 hello.wasm 三个文件。
- MODULARIZE 模块化，可以设置模块名字，减少 import 冲突
- EXPORT_ES6 以 ES6 语法格式导出
- EXPORT_NAME 指定模块名字
- ENVIRONMENT 指定运行环境，这种设置为 web
