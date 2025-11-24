<template>
  <div class="keyword-settings-container">
    <div class="setting-item keyword-setting">
      <label>알림 키워드</label>
      <div class="keyword-input-group">
        <input type="text" v-model.trim="newKeyword" @keyup.enter="addKeyword" placeholder="키워드 추가" class="form-input" />
        <button @click="addKeyword" class="btn btn-outline">추가</button>
      </div>
      <div class="keyword-list">
        <span v-for="keyword in currentKeywords" :key="keyword.keywordId" class="keyword-tag">
          {{ keyword.keywordName }}
          <button @click="removeKeyword(keyword.keywordName)" class="remove-keyword">&times;</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject } from 'vue'; // Import inject
import { authInstance } from "@/api";

export default {
  name: "KeywordSettings",
  inject: ["isLoggedIn", "showToast"],
  props: {
    currentKeywords: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['keywords-changed'],
  setup(props, { emit }) { // Restore emit
    const newKeyword = ref("");
    const isLoggedIn = inject("isLoggedIn");
    const showToast = inject("showToast");

    const addKeyword = async () => {
      if (!isLoggedIn.value) {
        showToast("로그인이 필요한 기능입니다.", { type: "error" });
        return;
      }
      if (!newKeyword.value) return;
      if (props.currentKeywords.some(k => k.keywordName === newKeyword.value)) {
        showToast("이미 등록된 키워드입니다.", { type: "info" });
        return;
      }

      try {
        await authInstance.post("/glemoa-member/keyword/save", {
          keywordName: newKeyword.value,
        });
        emit("keywords-changed");
        newKeyword.value = "";
        showToast("키워드가 추가되었습니다.", { type: "success" });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          showToast(error.response.data, { type: "error" });
        } else {
          console.error("키워드 추가 실패:", error);
          showToast("키워드 추가에 실패했습니다.", { type: "error" });
        }
      }
    };

    const removeKeyword = async (keywordName) => {
      if (!isLoggedIn.value) {
        showToast("로그인이 필요한 기능입니다.", { type: "error" });
        return;
      }
      try {
        await authInstance.delete(`/glemoa-member/keyword/${keywordName}`);
        emit("keywords-changed");
        showToast("키워드가 삭제되었습니다.", { type: "success" });
      } catch (error) {
        console.error("키워드 삭제 실패:", error);
        showToast("키워드 삭제에 실패했습니다.", { type: "error" });
      }
    };

    return {
      newKeyword,
      addKeyword,
      removeKeyword,
    };
  }
};
</script>

<style scoped>
.keyword-settings-container {
  padding: 24px;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.setting-item label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
  width: 100%;
}

.keyword-setting {
  flex-direction: column;
  align-items: flex-start;
}

.keyword-input-group {
  display: flex;
  width: 100%;
  gap: 8px;
}

.keyword-input-group .form-input {
  flex-grow: 1;
  width: auto;
}

.form-input {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--link-active-color);
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
}

.keyword-tag {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove-keyword {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}

.remove-keyword:hover {
  color: var(--text-primary);
}

.btn {
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
}

.btn:active {
  transform: scale(0.98);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-outline:hover {
  background-color: var(--bg-hover);
}
</style>
