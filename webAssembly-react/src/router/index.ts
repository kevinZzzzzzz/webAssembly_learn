import { lazy } from "react";

interface RouterInterface {
  key: number;
  name: string;
  path: string;
  component: any;
  children?: any[];
}

const HomePage: RouterInterface = {
  key: 0,
  name: "Home",
  path: "/home",
  component: lazy(
    () => import(/* webpackChunkName: "home" */ "@/pages/Home/index")
  ),
  children: [],
};
const TestPage: RouterInterface = {
  key: 0,
  name: "Test",
  path: "/test",
  component: lazy(
    () => import(/* webpackChunkName: "test" */ "@/pages/Test/index")
  ),
  children: [],
};
const TestWEB3Page: RouterInterface = {
  key: 0,
  name: "TestWEB3",
  path: "/testWeb3",
  component: lazy(
    () => import(/* webpackChunkName: "testWeb3" */ "@/pages/TestWEB3/index")
  ),
  children: [],
};
const NotFoundPage: RouterInterface = {
  key: 1,
  name: "NotFound",
  path: "/404",
  component: lazy(
    () => import(/* webpackChunkName: "404" */ "@/pages/404/index")
  ),
  children: [],
};

const AllRouters: RouterInterface[] = [
  HomePage,
  TestPage,
  NotFoundPage,
  TestWEB3Page,
];

export { AllRouters };
