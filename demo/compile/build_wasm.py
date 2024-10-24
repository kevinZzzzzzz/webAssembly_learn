import os

source_wasm_build_path =  ' ./../compile/c++/communication.cpp'

emcc_wasm_build_args = ' \
--post-js ./js/utils.js \
-o ../src/communication.wasm.js'
command_wasm_build = 'emcc -lembind -s WASM=1' + source_wasm_build_path + emcc_wasm_build_args
result = os.system(command_wasm_build)
if result == 0:
    print('Build wasm success')
else:
    print('Build wasm failed')
    exit(1)
