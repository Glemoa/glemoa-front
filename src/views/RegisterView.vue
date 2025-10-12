<template>
  <div class="register-container">
    <h1>회원가입</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name"></label>
        <input type="text" id="name" v-model="name" placeholder="이름" required />
      </div>
      <div class="form-group">
        <label for="email"></label>
        <input type="email" id="email" v-model="email" placeholder="이메일" required />
      </div>
      <div class="form-group">
        <label for="password"></label>
        <input type="password" id="password" v-model="password" placeholder="비밀번호" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword"></label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="비밀번호 확인" required />
      </div>
      <button type="submit">회원가입</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script>
import { defaultInstance } from "@/api";

export default {
  name: "RegisterView",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = "";
      this.successMessage = "";

      if (this.password !== this.confirmPassword) {
        this.errorMessage = "비밀번호가 일치하지 않습니다.";
        return;
      }

      try {
        await defaultInstance.post("/glemoa-member/member/doSave", {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        this.successMessage = "회원가입 성공! 로그인 페이지로 이동합니다...";
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        this.errorMessage = "회원가입에 실패했습니다. 다시 시도해주세요.";
        console.error("Registration error:", error);
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
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

input {
  width: 100%;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 16px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 15px;
  background-color: var(--link-active-color);
  color: var(--button-text);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  box-sizing: border-box;
}

.error-message {
  color: #e53e3e;
  margin-top: 15px;
}

.success-message {
  color: #38a169;
  margin-top: 15px;
}
</style>
