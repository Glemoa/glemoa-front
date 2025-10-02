<template>
    <div id="app">
        <div class="sticky-header">
            <header>
                <h1>Glemoa</h1>
            </header>
            <nav>
                <router-link to="/">home</router-link>
                <!-- 다른 메뉴들을 여기에 추가할 수 있습니다. -->
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
export default {
    name: "App",
};
</script>

<style>
/* Global styles */
body {
    margin: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
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
    background-color: white; /* 스크롤 시 아래 콘텐츠가 비치지 않도록 배경색 지정 */
}

header {
    background-color: #42b983;
    color: white;
    padding: 15px 20px;
    text-align: center;
}

header h1 {
    margin: 0;
    font-size: 1.5em;
}

nav {
    background-color: #f8f9fa;
    padding: 12px 20px;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: center;
}

nav a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    margin: 0 15px;
    padding: 5px 0;
}

nav a.router-link-exact-active {
    color: #42b983;
    border-bottom: 2px solid #42b983;
}

/* Footer */
footer {
    background-color: #f2f2f2;
    padding: 15px;
    text-align: center;
    width: 100%;
}
</style>
