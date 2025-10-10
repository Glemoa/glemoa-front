<template>
  <div class="register-container">
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name"></label>
        <input type="text" id="name" v-model="name" placeholder="Name" required />
      </div>
      <div class="form-group">
        <label for="email"></label>
        <input type="email" id="email" v-model="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <label for="password"></label>
        <input type="password" id="password" v-model="password" placeholder="Password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword"></label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm Password" required />
      </div>
      <button type="submit">Register</button>
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
        this.errorMessage = "Passwords do not match.";
        return;
      }

      try {
        await defaultInstance.post("/glemoa-member/member/doSave", {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        this.successMessage = "Registration successful! Redirecting to login...";
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        this.errorMessage = "Registration failed. Please try again.";
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
