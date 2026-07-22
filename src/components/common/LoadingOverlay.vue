<script setup>
import { useLoadingStore } from '@/stores/loadingStore'
import { ref } from 'vue'

const loading = useLoadingStore()
const hovering = ref(false)
</script>

<template>
  <!-- Transition: component có sẵn của Vue dùng để thêm Animation -->
  <Transition name="fade">
    <div v-if="loading.isLoading" class="loading-overlay">
      <div class="loading-card">
        <div class="caro-spinner">
          <div class="circle-o"></div>
          <div class="cross-x"></div>
        </div>
        <div
          class="loading-title"
          @mouseenter="hovering = true"
          @mouseleave="hovering = false"
          @click="loading.cancelable && loading.cancel()"
        >
          <span v-if="!hovering">
            {{ loading.message }}
          </span>
          <span v-else-if="loading.cancelable" class="cancel-text">
            {{ loading.messageCancel }}
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  position: fixed;

  inset: 0;

  background: rgba(0, 0, 0, 0.1);

  /* backdrop-filter: blur(2px); */

  display: flex;

  justify-content: center;

  align-items: center;

  z-index: 99999;
}

.loading-card {
  width: 220px;
  background: transparent;
  border-radius: 18px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.caro-spinner {
  position: relative;
  width: 90px;
  height: 90px;
}

.loading-title {
  background-color: var(--primary);
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid var(--border);
  color: var(--text);
  font-weight: 800;
}

.loading-title:hover {
  background: #ef4444;
  cursor: pointer;
}

/* ========================= */
/* O */
/* ========================= */

.circle-o {
  position: absolute;

  inset: 0;

  border: 6px solid #ff4d9d;

  border-radius: 50%;

  box-shadow:
    0 0 10px rgba(255, 3, 116, 0.9),
    0 0 25px rgba(255, 3, 116, 0.6),
    0 0 40px rgba(255, 3, 116, 0.4);

  animation: pulse 1.2s ease-in-out infinite;
}

/* ========================= */
/* X */
/* ========================= */

.cross-x {
  position: absolute;

  top: 50%;

  left: 50%;

  width: 34px;

  height: 34px;

  transform: translate(-50%, -50%);

  animation: rotateCross 0.4s steps(4) infinite;
}

.cross-x::before,
.cross-x::after {
  content: '';

  position: absolute;

  top: 50%;

  left: 50%;

  width: 34px;

  height: 6px;

  border-radius: 999px;

  background: #3b82f6;

  box-shadow:
    0 0 8px rgba(16, 105, 248, 0.8),
    0 0 18px rgba(16, 105, 248, 0.6),
    0 0 28px rgba(16, 105, 248, 0.3);

  transform-origin: center;
}

.cross-x::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.cross-x::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* ========================= */

@keyframes rotateCross {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);

    opacity: 1;
  }

  50% {
    transform: scale(1.08);

    opacity: 0.75;
  }

  100% {
    transform: scale(1);

    opacity: 1;
  }
}
</style>
