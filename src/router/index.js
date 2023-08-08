import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Test",
    component: () => import(/* webpackChunkName: "about" */ "@/views/test"),
  },
  {
    path: "/dragDemo",
    name: "dragDemo",
    component: () => import(/* webpackChunkName: "about" */ "@/views/dragDemo"),
  },
  {
    path: "/dargeDemo",
    name: "dargeDemo",
    component: () => import("@/views/dargeDemo"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
