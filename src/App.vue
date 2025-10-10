<template>
  <div id="app">
    <div class="sticky-header">
      <header>
        <h1>Glemoa</h1>
      </header>
      <nav>
        <router-link to="/">home</router-link>
        <router-link v-if="isLoggedIn" to="/bookmarks">Bookmarks</router-link>
        <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
        <a v-else @click="logout" href="#">Logout</a>
        <button @click="toggleTheme" class="theme-toggle-btn">
          <img :src="theme === 'light' ? darkModeIcon : lightModeIcon" alt="Toggle theme" :class="theme === 'light' ? 'dark-mode-icon' : 'light-mode-icon'" />
        </button>
      </nav>
    </div>
    <main>
      <router-view />
    </main>
    <footer>
      <p>&copy; 2025 Glemoa</p>
    </footer>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import darkModeIcon from "@/assets/images/dark_mode.png";
import lightModeIcon from "@/assets/images/light_mode.png";

export default {
  name: "App",
  setup() {
    const theme = ref(localStorage.getItem("theme") || "light");

    const toggleTheme = () => {
      theme.value = theme.value === "light" ? "dark" : "light";
    };

    watch(
      theme,
      (newTheme, oldTheme) => {
        if (oldTheme) {
          document.body.classList.remove(oldTheme);
        }
        document.body.classList.add(newTheme);
        localStorage.setItem("theme", newTheme);
      },
      { immediate: true }
    ); // immediate: true ensures it runs on component mount

    return { theme, toggleTheme, darkModeIcon, lightModeIcon };
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.checkLoginStatus();
      },
    },
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem("accessToken");
    },
    logout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.isLoggedIn = false;
      this.$router.push("/");
    },
  },
  created() {
    this.checkLoginStatus();
  },
};
</script>

<style>
:root {
  /* Light Theme Variables */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #f2f2f2;
  --text-primary: #2c3e50;
  --text-secondary: #495057;
  --border-color: #dee2e6;
  --header-bg: #4285f4;
  --header-text: #ffffff;
  --link-active-color: #4285f4;
  --button-text: #ffffff;
}

.dark {
  /* Dark Theme Variables */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2c2c2c;
  --bg-tertiary: #101010;
  --text-primary: #e0e0e0;
  --text-secondary: #adb5bd;
  --border-color: #424242;
  --header-bg: #333333;
  --header-text: #4285f4;
  --link-active-color: #4285f4;
  --button-text: #ffffff;
}

/* Global styles */
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 20px;
}

/* Sticky Header & Nav */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--bg-primary);
}

header {
  background-color: var(--header-bg);
  color: var(--header-text);
  padding: 15px 20px;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
}

header h1 {
  margin: 0;
  font-size: 1.5em;
}

nav {
  background-color: var(--bg-secondary);
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center; /* Center items vertically */
  gap: 20px; /* Add gap for consistent spacing */
  transition: background-color 0.3s, border-color 0.3s;
}

nav a {
  font-weight: bold;
  color: var(--text-primary);
  text-decoration: none;
  /* margin is removed to use gap instead */
  padding: 5px 0;
  transition: color 0.3s;
}

nav a.router-link-exact-active {
  color: var(--link-active-color);
  border-bottom: 2px solid var(--link-active-color);
}

.theme-toggle-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;

  /* Fixed size container */
  width: 40px;
  height: 40px;
  padding: 0; /* Remove padding */

  /* Center the icon inside */
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%; /* Optional: make it circular */
  transition: background-color 0.2s;
}

.theme-toggle-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dark-mode-icon {
  width: 24px;
  height: 24px;
}

.light-mode-icon {
  width: 24px;
  height: 24px;
}

/* Footer */
footer {
  background-color: var(--bg-tertiary);
  padding: 15px;
  text-align: center;
  width: 100%;
  transition: background-color 0.3s;
}
</style>
