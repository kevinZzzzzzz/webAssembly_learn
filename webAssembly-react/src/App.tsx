import React from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ReactDOM from "react-dom";
import { AllRouters as routes } from "./router/index";
import DefaultLayout from "./layout/Default";
import api from "@/api";
import CFun from "../C/CFun";

declare global {
  interface Window {
    $api: any;
    $CFun: any;
  }
}
/* 
  设置全局变量
*/
window.$api = { ...api };

// 1 构造wasm模块加载promise
const CFunPromise = CFun({
  noInitialRun: true,
  noExitRuntime: true,
});
function App() {
  useEffect(() => {
    // 2 加载和初始化wasm实例
    CFunPromise.then((module) => {
      console.log(module);
      window.$CFun = module;
      window.$CFun._main();
    });
  });
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />}></Route>
        <Route path="/:notFoundPath" element={<Navigate to="/404" />}></Route>
        {routes.map((e: any) => {
          return (
            <Route
              key={e.key}
              path={e.path}
              element={
                <DefaultLayout>
                  <e.component />
                </DefaultLayout>
              }
            ></Route>
          );
        })}
      </Routes>
    </HashRouter>
  );
}
export default App;
