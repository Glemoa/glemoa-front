import { createRouter, createWebHistory } from "vue-router";
import PostListView from "../views/PostListView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import BookmarkedPostsView from "../views/BookmarkedPostsView.vue";
import SearchView from "../views/SearchView.vue"; // Import SearchView
import GoogleRedirect from "../components/GoogleRedirect.vue";
import KakaoRedirect from "../components/KakaoRedirect.vue";

const routes = [
  {
    path: "/",
    name: "PostList",
    component: PostListView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/bookmarks",
    name: "BookmarkedPosts",
    component: BookmarkedPostsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/search", // Add search route
    name: "Search",
    component: SearchView,
  },
  {
    path: "/oauth/google/redirect",
    component: GoogleRedirect,
  },
  {
    path: "/oauth/kakao/redirect",
    component: KakaoRedirect,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
