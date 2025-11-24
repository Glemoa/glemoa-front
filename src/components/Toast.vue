<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" :class="typeClass">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'ToastNotification',
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'info', // 'info', 'success', 'error'
    },
    duration: {
      type: Number,
      default: 3000,
    },
  },
  setup(props, { emit }) {
    const visible = ref(false);

    onMounted(() => {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
        // Emitting an event when the toast is about to be removed
        setTimeout(() => emit('close'), 500); // Wait for fade-out transition
      }, props.duration);
    });

    const typeClass = `toast-${props.type}`;

    return {
      visible,
      typeClass,
    };
  },
};
</script>

<style scoped>
.toast {
  padding: 12px 24px;
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  border: 1px solid var(--border-color);
  position: relative; /* Let the container control position */
  transition: all 0.5s ease; /* Animate all properties */
}

.toast-success {
  background-color: #4caf50;
  color: white;
  border: none;
}

.toast-error {
  background-color: #f44336;
  color: white;
  border: none;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
