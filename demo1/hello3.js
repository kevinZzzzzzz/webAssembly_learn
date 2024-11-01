var Module = (() => {
  var _scriptName = import.meta.url

  return async function (moduleArg = {}) {
    var moduleRtn

    var Module = moduleArg
    var readyPromiseResolve, readyPromiseReject
    var readyPromise = new Promise((resolve, reject) => {
      readyPromiseResolve = resolve
      readyPromiseReject = reject
    })
    var ENVIRONMENT_IS_WEB = typeof window == "object"
    var ENVIRONMENT_IS_WORKER = typeof importScripts == "function"
    var ENVIRONMENT_IS_NODE =
      typeof process == "object" &&
      typeof process.versions == "object" &&
      typeof process.versions.node == "string" &&
      process.type != "renderer"
    if (ENVIRONMENT_IS_NODE) {
      const { createRequire } = await import("module")
      let dirname = import.meta.url
      if (dirname.startsWith("data:")) {
        dirname = "/"
      }
      var require = createRequire(dirname)
    }
    var moduleOverrides = Object.assign({}, Module)
    var arguments_ = []
    var thisProgram = "./this.program"
    var quit_ = (status, toThrow) => {
      throw toThrow
    }
    var scriptDirectory = ""
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
      }
      return scriptDirectory + path
    }
    var readAsync, readBinary
    if (ENVIRONMENT_IS_NODE) {
      var fs = require("fs")
      var nodePath = require("path")
      if (!import.meta.url.startsWith("data:")) {
        scriptDirectory =
          nodePath.dirname(require("url").fileURLToPath(import.meta.url)) + "/"
      }
      readBinary = (filename) => {
        filename = isFileURI(filename)
          ? new URL(filename)
          : nodePath.normalize(filename)
        var ret = fs.readFileSync(filename)
        return ret
      }
      readAsync = (filename, binary = true) => {
        filename = isFileURI(filename)
          ? new URL(filename)
          : nodePath.normalize(filename)
        return new Promise((resolve, reject) => {
          fs.readFile(filename, binary ? undefined : "utf8", (err, data) => {
            if (err) reject(err)
            else resolve(binary ? data.buffer : data)
          })
        })
      }
      if (!Module["thisProgram"] && process.argv.length > 1) {
        thisProgram = process.argv[1].replace(/\\/g, "/")
      }
      arguments_ = process.argv.slice(2)
      quit_ = (status, toThrow) => {
        process.exitCode = status
        throw toThrow
      }
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href
      } else if (typeof document != "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src
      }
      if (_scriptName) {
        scriptDirectory = _scriptName
      }
      if (scriptDirectory.startsWith("blob:")) {
        scriptDirectory = ""
      } else {
        scriptDirectory = scriptDirectory.substr(
          0,
          scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1
        )
      }
      {
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            var xhr = new XMLHttpRequest()
            xhr.open("GET", url, false)
            xhr.responseType = "arraybuffer"
            xhr.send(null)
            return new Uint8Array(xhr.response)
          }
        }
        readAsync = (url) => {
          if (isFileURI(url)) {
            return new Promise((resolve, reject) => {
              var xhr = new XMLHttpRequest()
              xhr.open("GET", url, true)
              xhr.responseType = "arraybuffer"
              xhr.onload = () => {
                if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                  resolve(xhr.response)
                  return
                }
                reject(xhr.status)
              }
              xhr.onerror = reject
              xhr.send(null)
            })
          }
          return fetch(url, { credentials: "same-origin" }).then((response) => {
            if (response.ok) {
              return response.arrayBuffer()
            }
            return Promise.reject(
              new Error(response.status + " : " + response.url)
            )
          })
        }
      }
    } else {
    }
    var out = Module["print"] || console.log.bind(console)
    var err = Module["printErr"] || console.error.bind(console)
    Object.assign(Module, moduleOverrides)
    moduleOverrides = null
    if (Module["arguments"]) arguments_ = Module["arguments"]
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"]
    var wasmBinary = Module["wasmBinary"]
    var wasmMemory
    var ABORT = false
    var EXITSTATUS
    var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64
    function updateMemoryViews() {
      var b = wasmMemory.buffer
      Module["HEAP8"] = HEAP8 = new Int8Array(b)
      Module["HEAP16"] = HEAP16 = new Int16Array(b)
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(b)
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(b)
      Module["HEAP32"] = HEAP32 = new Int32Array(b)
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(b)
      Module["HEAPF32"] = HEAPF32 = new Float32Array(b)
      Module["HEAPF64"] = HEAPF64 = new Float64Array(b)
    }
    var __ATPRERUN__ = []
    var __ATINIT__ = []
    var __ATMAIN__ = []
    var __ATPOSTRUN__ = []
    var runtimeInitialized = false
    function preRun() {
      var preRuns = Module["preRun"]
      if (preRuns) {
        if (typeof preRuns == "function") preRuns = [preRuns]
        preRuns.forEach(addOnPreRun)
      }
      callRuntimeCallbacks(__ATPRERUN__)
    }
    function initRuntime() {
      runtimeInitialized = true
      callRuntimeCallbacks(__ATINIT__)
    }
    function preMain() {
      callRuntimeCallbacks(__ATMAIN__)
    }
    function postRun() {
      var postRuns = Module["postRun"]
      if (postRuns) {
        if (typeof postRuns == "function") postRuns = [postRuns]
        postRuns.forEach(addOnPostRun)
      }
      callRuntimeCallbacks(__ATPOSTRUN__)
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb)
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb)
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb)
    }
    var runDependencies = 0
    var runDependencyWatcher = null
    var dependenciesFulfilled = null
    function addRunDependency(id) {
      runDependencies++
      Module["monitorRunDependencies"]?.(runDependencies)
    }
    function removeRunDependency(id) {
      runDependencies--
      Module["monitorRunDependencies"]?.(runDependencies)
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher)
          runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled
          dependenciesFulfilled = null
          callback()
        }
      }
    }
    function abort(what) {
      Module["onAbort"]?.(what)
      what = "Aborted(" + what + ")"
      err(what)
      ABORT = true
      what += ". Build with -sASSERTIONS for more info."
      var e = new WebAssembly.RuntimeError(what)
      readyPromiseReject(e)
      throw e
    }
    var dataURIPrefix = "data:application/octet-stream;base64,"
    var isDataURI = (filename) => filename.startsWith(dataURIPrefix)
    var isFileURI = (filename) => filename.startsWith("file://")
    function findWasmBinary() {
      if (Module["locateFile"]) {
        var f = "hello3.wasm"
        if (!isDataURI(f)) {
          return locateFile(f)
        }
        return f
      }
      return new URL("hello3.wasm", import.meta.url).href
    }
    var wasmBinaryFile
    function getBinarySync(file) {
      if (file == wasmBinaryFile && wasmBinary) {
        return new Uint8Array(wasmBinary)
      }
      if (readBinary) {
        return readBinary(file)
      }
      throw "both async and sync fetching of the wasm failed"
    }
    function getBinaryPromise(binaryFile) {
      if (!wasmBinary) {
        return readAsync(binaryFile).then(
          (response) => new Uint8Array(response),
          () => getBinarySync(binaryFile)
        )
      }
      return Promise.resolve().then(() => getBinarySync(binaryFile))
    }
    function instantiateArrayBuffer(binaryFile, imports, receiver) {
      return getBinaryPromise(binaryFile)
        .then((binary) => WebAssembly.instantiate(binary, imports))
        .then(receiver, (reason) => {
          err(`failed to asynchronously prepare wasm: ${reason}`)
          abort(reason)
        })
    }
    function instantiateAsync(binary, binaryFile, imports, callback) {
      if (
        !binary &&
        typeof WebAssembly.instantiateStreaming == "function" &&
        !isDataURI(binaryFile) &&
        !isFileURI(binaryFile) &&
        !ENVIRONMENT_IS_NODE &&
        typeof fetch == "function"
      ) {
        return fetch(binaryFile, { credentials: "same-origin" }).then(
          (response) => {
            var result = WebAssembly.instantiateStreaming(response, imports)
            return result.then(callback, function (reason) {
              err(`wasm streaming compile failed: ${reason}`)
              err("falling back to ArrayBuffer instantiation")
              return instantiateArrayBuffer(binaryFile, imports, callback)
            })
          }
        )
      }
      return instantiateArrayBuffer(binaryFile, imports, callback)
    }
    function getWasmImports() {
      return { a: wasmImports }
    }
    function createWasm() {
      var info = getWasmImports()
      function receiveInstance(instance, module) {
        wasmExports = instance.exports
        wasmMemory = wasmExports["c"]
        updateMemoryViews()
        addOnInit(wasmExports["d"])
        removeRunDependency("wasm-instantiate")
        return wasmExports
      }
      addRunDependency("wasm-instantiate")
      function receiveInstantiationResult(result) {
        receiveInstance(result["instance"])
      }
      if (Module["instantiateWasm"]) {
        try {
          return Module["instantiateWasm"](info, receiveInstance)
        } catch (e) {
          err(`Module.instantiateWasm callback failed with error: ${e}`)
          readyPromiseReject(e)
        }
      }
      wasmBinaryFile ??= findWasmBinary()
      instantiateAsync(
        wasmBinary,
        wasmBinaryFile,
        info,
        receiveInstantiationResult
      ).catch(readyPromiseReject)
      return {}
    }
    function ExitStatus(status) {
      this.name = "ExitStatus"
      this.message = `Program terminated with exit(${status})`
      this.status = status
    }
    var callRuntimeCallbacks = (callbacks) => {
      callbacks.forEach((f) => f(Module))
    }
    var noExitRuntime = Module["noExitRuntime"] || true
    var stackRestore = (val) => __emscripten_stack_restore(val)
    var stackSave = () => _emscripten_stack_get_current()
    var __emscripten_memcpy_js = (dest, src, num) =>
      HEAPU8.copyWithin(dest, src, src + num)
    var printCharBuffers = [null, [], []]
    var UTF8Decoder =
      typeof TextDecoder != "undefined" ? new TextDecoder() : undefined
    var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
      var endIdx = idx + maxBytesToRead
      var endPtr = idx
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))
      }
      var str = ""
      while (idx < endPtr) {
        var u0 = heapOrArray[idx++]
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0)
          continue
        }
        var u1 = heapOrArray[idx++] & 63
        if ((u0 & 224) == 192) {
          str += String.fromCharCode(((u0 & 31) << 6) | u1)
          continue
        }
        var u2 = heapOrArray[idx++] & 63
        if ((u0 & 240) == 224) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2
        } else {
          u0 =
            ((u0 & 7) << 18) |
            (u1 << 12) |
            (u2 << 6) |
            (heapOrArray[idx++] & 63)
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0)
        } else {
          var ch = u0 - 65536
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023))
        }
      }
      return str
    }
    var printChar = (stream, curr) => {
      var buffer = printCharBuffers[stream]
      if (curr === 0 || curr === 10) {
        ;(stream === 1 ? out : err)(UTF8ArrayToString(buffer))
        buffer.length = 0
      } else {
        buffer.push(curr)
      }
    }
    var UTF8ToString = (ptr, maxBytesToRead) =>
      ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
    var _fd_write = (fd, iov, iovcnt, pnum) => {
      var num = 0
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2]
        var len = HEAPU32[(iov + 4) >> 2]
        iov += 8
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr + j])
        }
        num += len
      }
      HEAPU32[pnum >> 2] = num
      return 0
    }
    var runtimeKeepaliveCounter = 0
    var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0
    var _proc_exit = (code) => {
      EXITSTATUS = code
      if (!keepRuntimeAlive()) {
        Module["onExit"]?.(code)
        ABORT = true
      }
      quit_(code, new ExitStatus(code))
    }
    var exitJS = (status, implicit) => {
      EXITSTATUS = status
      _proc_exit(status)
    }
    var handleException = (e) => {
      if (e instanceof ExitStatus || e == "unwind") {
        return EXITSTATUS
      }
      quit_(1, e)
    }
    var getCFunc = (ident) => {
      var func = Module["_" + ident]
      return func
    }
    var writeArrayToMemory = (array, buffer) => {
      HEAP8.set(array, buffer)
    }
    var lengthBytesUTF8 = (str) => {
      var len = 0
      for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i)
        if (c <= 127) {
          len++
        } else if (c <= 2047) {
          len += 2
        } else if (c >= 55296 && c <= 57343) {
          len += 4
          ++i
        } else {
          len += 3
        }
      }
      return len
    }
    var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      if (!(maxBytesToWrite > 0)) return 0
      var startIdx = outIdx
      var endIdx = outIdx + maxBytesToWrite - 1
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i)
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i)
          u = (65536 + ((u & 1023) << 10)) | (u1 & 1023)
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break
          heap[outIdx++] = u
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break
          heap[outIdx++] = 192 | (u >> 6)
          heap[outIdx++] = 128 | (u & 63)
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break
          heap[outIdx++] = 224 | (u >> 12)
          heap[outIdx++] = 128 | ((u >> 6) & 63)
          heap[outIdx++] = 128 | (u & 63)
        } else {
          if (outIdx + 3 >= endIdx) break
          heap[outIdx++] = 240 | (u >> 18)
          heap[outIdx++] = 128 | ((u >> 12) & 63)
          heap[outIdx++] = 128 | ((u >> 6) & 63)
          heap[outIdx++] = 128 | (u & 63)
        }
      }
      heap[outIdx] = 0
      return outIdx - startIdx
    }
    var stringToUTF8 = (str, outPtr, maxBytesToWrite) =>
      stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
    var stackAlloc = (sz) => __emscripten_stack_alloc(sz)
    var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1
      var ret = stackAlloc(size)
      stringToUTF8(str, ret, size)
      return ret
    }
    var ccall = (ident, returnType, argTypes, args, opts) => {
      var toC = {
        string: (str) => {
          var ret = 0
          if (str !== null && str !== undefined && str !== 0) {
            ret = stringToUTF8OnStack(str)
          }
          return ret
        },
        array: (arr) => {
          var ret = stackAlloc(arr.length)
          writeArrayToMemory(arr, ret)
          return ret
        },
      }
      function convertReturnValue(ret) {
        if (returnType === "string") {
          return UTF8ToString(ret)
        }
        if (returnType === "boolean") return Boolean(ret)
        return ret
      }
      var func = getCFunc(ident)
      var cArgs = []
      var stack = 0
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]]
          if (converter) {
            if (stack === 0) stack = stackSave()
            cArgs[i] = converter(args[i])
          } else {
            cArgs[i] = args[i]
          }
        }
      }
      var ret = func(...cArgs)
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack)
        return convertReturnValue(ret)
      }
      ret = onDone(ret)
      return ret
    }
    var wasmImports = { b: __emscripten_memcpy_js, a: _fd_write }
    var wasmExports = createWasm()
    var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["d"])()
    var _myFunction = (Module["_myFunction"] = (a0, a1) =>
      (_myFunction = Module["_myFunction"] = wasmExports["e"])(a0, a1))
    var _main = (Module["_main"] = (a0, a1) =>
      (_main = Module["_main"] = wasmExports["f"])(a0, a1))
    var __emscripten_stack_restore = (a0) =>
      (__emscripten_stack_restore = wasmExports["h"])(a0)
    var __emscripten_stack_alloc = (a0) =>
      (__emscripten_stack_alloc = wasmExports["i"])(a0)
    var _emscripten_stack_get_current = () =>
      (_emscripten_stack_get_current = wasmExports["j"])()
    Module["ccall"] = ccall
    var calledRun
    var calledPrerun
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run()
      if (!calledRun) dependenciesFulfilled = runCaller
    }
    function callMain() {
      var entryFunction = _main
      var argc = 0
      var argv = 0
      try {
        var ret = entryFunction(argc, argv)
        exitJS(ret, true)
        return ret
      } catch (e) {
        return handleException(e)
      }
    }
    function run() {
      if (runDependencies > 0) {
        return
      }
      if (!calledPrerun) {
        calledPrerun = 1
        preRun()
        if (runDependencies > 0) {
          return
        }
      }
      function doRun() {
        if (calledRun) return
        calledRun = 1
        Module["calledRun"] = 1
        if (ABORT) return
        initRuntime()
        preMain()
        readyPromiseResolve(Module)
        Module["onRuntimeInitialized"]?.()
        if (shouldRunNow) callMain()
        postRun()
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...")
        setTimeout(() => {
          setTimeout(() => Module["setStatus"](""), 1)
          doRun()
        }, 1)
      } else {
        doRun()
      }
    }
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]]
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
      }
    }
    var shouldRunNow = true
    if (Module["noInitialRun"]) shouldRunNow = false
    run()
    moduleRtn = readyPromise

    return moduleRtn
  }
})()
export default Module
