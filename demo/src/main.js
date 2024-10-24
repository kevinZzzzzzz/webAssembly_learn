const Module = require("./communication.wasm.js")
console.log(Module)
// Wasm模块加载并初始化完成后被调用的回调函数
Module.onRuntimeInitialized = (_) => {
  const communicateModule = new Module.Communication()

  // 调用 C++ 层的函数
  communicateModule.executeCb()

  // js 层的函数在 C++ 层被调用
  communicateModule.monitorCb(() => {
    console.log("这是 js 层的函数在 C++ 层被调用")
  }, true)

  // 编译 C++ 代码时在末尾插入的额外的 js 代码
  const result = Module.safelyParse("{name: 'icebergfeng'}")
  console.log(result)
}
