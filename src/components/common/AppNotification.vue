<script setup>
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()
</script>

<template>
  <TransitionGroup name="toast" tag="div" class="notification-container">
    <div
      v-for="notification in notificationStore.notifications"
      :key="notification.id"
      class="notification"
      :class="notification.type"
    >
      <span class="icon">
        <i v-if="notification.type === 'success'" class="fa-solid fa-circle-check fa-jello"></i>

        <i v-else-if="notification.type === 'error'" class="fa-solid fa-bug fa-beat"></i>

        <i
          v-else-if="notification.type === 'warning'"
          class="fa-solid fa-triangle-exclamation fa-jello"
        ></i>

        <i v-else class="fa-solid fa-circle-info fa-jello"></i>
      </span>

      <span class="message">{{ notification.message }}</span>

      <button class="close-btn" @click="notificationStore.hide(notification.id)">
        <i class="fa-solid fa-x fa-jello"></i>
      </button>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 24px;
  right: 24px;
  left: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
  max-width: 420px;
  width: min(420px, calc(100vw - 48px));
}

.notification {
  width: 100%;
  min-width: 0;
  padding: 14px 18px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow);
  z-index: 9999;
  border: 2px solid;
}

/* Success */
.notification.success {
  background: #ecfdf5;

  border-color: #22c55e;

  color: #15803d;
}

/* Error */
.notification.error {
  background: #fef2f2;

  border-color: #ef4444;

  color: #b91c1c;
}

/* Warning */
.notification.warning {
  background: #fffbeb;

  border-color: #f59e0b;

  color: #b45309;
}

/* Info */
.notification.info {
  background: #eff6ff;

  border-color: var(--primary);

  color: var(--primary);
}

.icon {
  font-size: 22px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message {
  flex: 1;
  min-width: 0;
  word-break: break-word;
}

.close-btn {
  margin-left: auto;
  flex-shrink: 0;
  background: transparent;
  color: inherit;
  font-size: 18px;
  padding: 4px;
  border-radius: 50%;
  transition: var(--transition);
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.08);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

/* =========================================================
   RESPONSIVE
   ========================================================= */

/* Tablet: slightly tighter margins */
@media (max-width: 768px) {
  .notification-container {
    top: 16px;
    right: 16px;
    width: min(380px, calc(100vw - 32px));
  }
}

/* Mobile: full-width toast anchored to top, centered horizontally */
@media (max-width: 560px) {
  .notification-container {
    top: 12px;
    right: 12px;
    left: 12px;
    width: auto;
    max-width: none;
  }

  .notification {
    padding: 12px 14px;
    gap: 10px;
    border-radius: 12px;
    font-size: 14px;
  }

  .icon {
    font-size: 18px;
  }

  .close-btn {
    font-size: 15px;
  }

  /* Slide up/down instead of sideways so it doesn't clip off narrow screens */
  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateY(-16px);
  }
}
</style>
