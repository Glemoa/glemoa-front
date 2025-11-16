<template>
  <div class="login-container">
    <h1>로그인</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" placeholder="이메일" required />
      </div>
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="password" placeholder="비밀번호" required />
      </div>
      <button type="submit">로그인</button>
    </form>
    <button @click="goToRegister" class="register-btn">회원가입</button>
    <div class="or-divider-container">
      <span class="or-text">OR</span>
    </div>
    <div class="social-login-container">
      <div @click="handleGoogleLogin" class="social-login-circle google-circle">
        <img src="../assets/images/Google_logo.svg" alt="Google Logo" class="social-login-logo" />
      </div>
      <div @click="handleKakaoLogin" class="social-login-circle kakao-circle">
        <img src="../assets/images/KakaoTalk_logo.svg" alt="Kakao Logo" class="social-login-logo" />
      </div>
    </div>
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
      googleUrl: "https://accounts.google.com/o/oauth2/auth",
      googleClientId: "1016866503845-g2stk5ilu15a3i4qj492md1lk85s76v4.apps.googleusercontent.com",
      googleRedirectUrl: process.env.VUE_APP_GOOGLE_REDIRECT_URI,
      // 인가코드로 받겠다는 설정
      googleResponseType: "code",
      // openid는 요청하지 않아도 기본적으로 제공한다. email과 profile은 요청시 제공
      googleScope: "openid email profile",

      kakaoClientId: "4c59ef5dce393223983be904010b1b73",
      kakaoUrl: "https://kauth.kakao.com/oauth/authorize",
      kakaoResponseType: "code",
      kakaoRedirectUrl: process.env.VUE_APP_KAKAO_REDIRECT_URI,
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
        this.errorMessage = "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.";
        console.error("Login error:", error);
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
    handleGoogleLogin() {
      // 로그인을 하고 나면 우리 화면으로 redirect가 될 거다.
      const auth_uri = `${this.googleUrl}?client_id=${this.googleClientId}&redirect_uri=${this.googleRedirectUrl}&response_type=${this.googleResponseType}&scope=${this.googleScope}`;
      window.location.href = auth_uri;
    },
    handleKakaoLogin() {
      const auth_uri = `${this.kakaoUrl}?client_id=${this.kakaoClientId}&redirect_uri=${this.kakaoRedirectUrl}&response_type=${this.kakaoResponseType}`;
      window.location.href = auth_uri;
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

.or-divider-container {
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 400px;
  margin: 20px 0;
}

.or-divider-container::before,
.or-divider-container::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.or-divider-container:not(:empty)::before {
  margin-right: 0.25em;
}

.or-divider-container:not(:empty)::after {
  margin-left: 0.25em;
}

.or-text {
  color: var(--text-secondary);
  font-size: 14px;
  padding: 0 10px;
}

.social-login-container {
  display: flex;
  justify-content: center;
  gap: 20px; /* Space between buttons */
  margin-top: 20px;
}

.social-login-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.social-login-circle:hover {
  transform: scale(1.05);
}

.google-circle {
  background-color: #ffffff;
  border: 1px solid #dadce0;
}

.kakao-circle {
  background-color: #fee500;
}

.social-login-logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
</style>
