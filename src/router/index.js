import { createRouter, createWebHistory } from "vue-router";
import PostListView from "../views/PostListView.vue";

const routes = [
  {
    path: "/",
    name: "PostList",
    component: PostListView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
