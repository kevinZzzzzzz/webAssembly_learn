emcc fun.c -o ./CFun.js -g1 -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s 'EXPORT_NAME="CFun"' -s "EXPORTED_RUNTIME_METHODS=['ccall','cwrap']" -s 'ENVIRONMENT="web"'