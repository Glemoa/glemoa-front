<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <button @click="goToRegister" class="register-btn">Register</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { defaultInstance } from "@/api";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await defaultInstance.post("/glemoa-member/member/doLogin", {
          email: this.email,
          password: this.password,
        });
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = "Login failed. Please check your credentials.";
        console.error("Login error:", error);
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; /* Use height 100% to fill main area */
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 40px;
}

form {
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: none; /* Hide labels, use placeholders       */
}

input {
  width: 100%;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out, background-color 0.3s, color 0.3s;
}

input::placeholder {
  color: var(--text-secondary);
}

input:focus {
  outline: none;
  border-color: var(--link-active-color);
}

button {
  width: 100%;
  padding: 15px;
  background-color: var(--link-active-color);
  color: var(--button-text);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  opacity: 0.8;
}

.error-message {
  color: #e53e3e;
  margin-top: 15px;
  text-align: center;
}

.register-btn {
  margin-top: 10px;
  width: 100%;
  max-width: 400px;
  padding: 15px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style>
