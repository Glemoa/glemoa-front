<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h2>설정</h2>
          <button @click="close" class="close-icon">&times;</button>
        </div>

        <div class="modal-body">
          <div class="setting-item">
            <label for="page-size-input">페이지당 게시물 수</label>
            <input id="page-size-input" type="number" v-model.number="selectedPageSize" min="1" max="100" class="form-input" />
          </div>
          <div class="setting-item">
            <label>테마</label>
            <div class="theme-selector">
              <button @click="setTheme('light')" :class="{ active: selectedTheme === 'light' }">Light</button>
              <button @click="setTheme('dark')" :class="{ active: selectedTheme === 'dark' }">Dark</button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="onPageSizeChange" class="btn btn-primary">저장</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "SettingsModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    currentPageSize: {
      type: Number,
      required: true,
    },
    currentTheme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedPageSize: this.currentPageSize,
      selectedTheme: this.currentTheme,
    };
  },
  watch: {
    currentPageSize(newSize) {
      this.selectedPageSize = newSize;
    },
    currentTheme(newTheme) {
      this.selectedTheme = newTheme;
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    onPageSizeChange() {
      if (this.selectedPageSize > 0 && this.selectedPageSize <= 100) {
        this.$emit("page-size-changed", this.selectedPageSize);
      } else {
        alert("1에서 100 사이의 값을 입력해주세요.");
      }
    },
    setTheme(theme) {
      this.selectedTheme = theme;
      this.$emit("set-theme", theme);
    },
  },
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: all 0.3s ease;
}
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
  opacity: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-icon {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.close-icon:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-item label {
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 12px;
  width: 80px;
  text-align: center;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--link-active-color);
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
}

.theme-selector {
  display: flex;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.theme-selector button {
  background-color: transparent;
  color: var(--text-secondary);
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-weight: 500;
}

.theme-selector button.active {
  background-color: var(--link-active-color);
  color: #fff;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
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

.btn-primary {
  background-color: var(--link-active-color);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}
</style>
