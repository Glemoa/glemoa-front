<template>
  <div class="container">
    <div class="loader"></div>
    <p>로그인 중입니다...</p>
  </div>
</template>

<script>
import { defaultInstance } from "@/api";

export default {
  created() {
    // 인가 코드를 꺼내면 이제 서버쪽으로 넘겨줘야 한다.
    const code = new URL(window.location.href).searchParams.get("code");
    console.log(code);
    this.sendCodeToServer(code);
  },
  methods: {
    async sendCodeToServer(code) {
      // 서버로 인가 코드를 넘겨줄 건데 응답으로 받는 것은 JWT를 받는다.
      const response = await defaultInstance.post("/glemoa-member/member/kakao/doLogin", { code: code });
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.location.href = "/";
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

p {
  margin-top: 20px;
  font-size: 1.2em;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
