<template>
  <div id="app">
    <div class="sticky-header">
      <header>
        <div class="search-container">
          <input type="text" v-model="searchKeyword" @keyup.enter="performSearch" placeholder="Glemoa에서 검색..." class="search-input" />
          <button @click="performSearch" class="search-button"><img class="search-icon" :src="researchIcon" alt="Search" /></button>
        </div>
      </header>
      <nav>
        <div class="nav-buttons-left">
          <button @click="showSettingsModal = true" class="settings-btn">≡</button>
        </div>
        <router-link to="/">홈</router-link>
        <router-link v-if="isLoggedIn" to="/bookmarks">즐겨찾기</router-link>
        <router-link v-if="!isLoggedIn" to="/login">로그인</router-link>
        <a v-else @click="logout" href="#">로그아웃</a>
        <div class="nav-buttons">
          <!-- Theme toggle button removed -->
        </div>
      </nav>
    </div>
    <div class="main-content-wrapper">
      <main>
        <router-view />
      </main>
      <footer>
        <p>&copy; 2025 Glemoa</p>
      </footer>
    </div>
    <SettingsModal :show="showSettingsModal" :currentPageSize="settings.globalPageSize" :currentTheme="theme" @close="showSettingsModal = false" @page-size-changed="handlePageSizeChanged" @set-theme="setTheme" />
  </div>
</template>

<script>
import { ref, watch, provide, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import darkModeIcon from "@/assets/images/dark_mode.png";
import lightModeIcon from "@/assets/images/light_mode.png";
import researchIcon from "@/assets/images/research.svg";
import SettingsModal from "@/components/SettingsModal.vue";

export default {
  name: "App",
  components: {
    SettingsModal,
  },
  setup() {
    // Theme Management
    const theme = ref(localStorage.getItem("theme") || "light");
    const setTheme = (newTheme) => {
      theme.value = newTheme;
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
    );

    // Login Status Management
    const isLoggedIn = ref(false);
    const route = useRoute();
    const router = useRouter();
    const checkLoginStatus = () => {
      isLoggedIn.value = !!localStorage.getItem("accessToken");
    };
    const logout = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      isLoggedIn.value = false;
      router.push("/");
    };
    watch(route, checkLoginStatus, { immediate: true, deep: true });
    onMounted(checkLoginStatus);

    // Settings Modal Management
    const showSettingsModal = ref(false);
    const settings = reactive({
      globalPageSize: 10,
    });
    const loadSettings = () => {
      const savedPageSize = localStorage.getItem("globalPageSize");
      if (savedPageSize) {
        settings.globalPageSize = parseInt(savedPageSize, 10);
      }
    };
    const handlePageSizeChanged = (newPageSize) => {
      settings.globalPageSize = newPageSize;
      localStorage.setItem("globalPageSize", newPageSize);
      showSettingsModal.value = false;
    };
    onMounted(loadSettings);

    // Provide to child components
    provide("isLoggedIn", isLoggedIn);
    provide("settings", settings);

    // Search Management
    const searchKeyword = ref("");
    const performSearch = () => {
      if (searchKeyword.value.trim()) {
        router.push({ name: "Search", query: { keyword: searchKeyword.value.trim() } });
        searchKeyword.value = ""; // Clear input after search
      }
    };

    return {
      theme,
      setTheme,
      isLoggedIn,
      logout,
      showSettingsModal,
      settings,
      handlePageSizeChanged,
      searchKeyword,
      performSearch,
      // Kept for compatibility with template, though toggle is removed
      darkModeIcon,
      lightModeIcon,
      researchIcon,
    };
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
html,
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Key for app-shell layout: prevent the whole page from scrolling */
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%; /* Fill the entire viewport height */
  background-color: var(--bg-primary);
}

/* Header & Nav */
.sticky-header {
  flex-shrink: 0; /* Prevent header from shrinking */
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--bg-primary);
}

header {
  background-color: var(--header-bg);
  color: var(--header-text);
  padding: 15px 20px;
  display: flex; /* Use flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  transition: background-color 0.3s, color 0.3s;
}

.search-container {
  display: flex;
  align-items: center;
  width: 50%;
  max-width: 600px;
  /* ⭐️ 흰색 배경을 설정합니다. (컨테이너 내 여백 부분) */
  background-color: var(--bg-primary);
  /* ⭐️ input/button 주변에 여백을 만듭니다. (디시 스타일의 핵심) */
  padding: 5px;
  /* 테두리 색상도 이미지와 유사하게 진한 색으로 변경 */
  border: 2px solid var(--link-active-color);
  border-radius: 0;
  overflow: hidden;
}

.search-input {
  flex-grow: 1;
  padding: 12px 20px;
  /* ⭐️ 자체 테두리 제거. 컨테이너의 테두리를 공유 */
  border: none;
  /* ⭐️ 둥근 모서리 제거 */
  border-radius: 0;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1em;
  outline: none;
}

.search-input:focus {
  outline: none;
  border-color: var(--link-active-color);
  width: 250px;
}

.search-button {
  padding: 12px 15px;
  border: none;
  background-color: var(--link-active-color); /* Blue background */
  color: white; /* White icon/text */
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1); /* Turns black SVG to white */
}

.search-button:hover {
  opacity: 0.9;
}

/* Responsive styles for mobile */
@media (max-width: 600px) {
  /* ⭐️ header padding 조정 */
  header {
    padding: 15px 10px;
  }

  .search-container {
    /* ⭐️ 모바일에서 90%~95% 정도로 설정하여 좌우 여백을 최소화합니다. */
    width: 90%;

    /* ⭐️ 모바일에서는 max-width가 불필요하며, 
       현재 .search-container에 적용된 max-width: 600px을 무시해야 합니다. */
    max-width: none;

    /* 필요하다면 내부 padding도 조금 줄여서 높이를 낮출 수 있습니다. */
    padding: 3px;
  }

  /* input의 padding도 필요하다면 조정할 수 있습니다. */
  .search-input {
    padding: 8px 15px;
  }
}

nav {
  position: relative;
  background-color: var(--bg-secondary);
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  transition: background-color 0.3s, border-color 0.3s;
}

nav a {
  min-width: 80px;
  text-align: center;
  font-weight: bold;
  color: var(--text-primary);
  text-decoration: none;
  padding: 5px 0;
  transition: color 0.3s;
}

nav a.router-link-exact-active {
  color: var(--link-active-color);
  border-bottom: 2px solid var(--link-active-color);
}

.nav-buttons-left {
  position: absolute;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-buttons {
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Main Content Area */
.main-content-wrapper {
  flex: 1; /* Take up all available space */
  overflow-y: auto; /* Enable vertical scrolling for this container only */
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

main {
  padding: 20px;
}

/* Footer */
footer {
  flex-shrink: 0; /* Prevent footer from shrinking */
  background-color: var(--bg-tertiary);
  padding: 15px;
  text-align: center;
  width: 100%;
  transition: background-color 0.3s;
}

.settings-btn,
.theme-toggle-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.settings-btn:hover,
.theme-toggle-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.settings-btn {
  font-size: 22px;
}

.dark-mode-icon,
.light-mode-icon {
  width: 24px;
  height: 24px;
}

/* Special cases for logos */
.light .community-logo[src*="clien"],
.light .community-logo[src*="theqoo"] {
  filter: brightness(0);
}
</style>
