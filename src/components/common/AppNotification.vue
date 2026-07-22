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

        <i v-else-if="notification.type === 'warning'" class="fa-solid fa-triangle-exclamation fa-jello"></i>

        <i v-else class="fa-solid fa-circle-info fa-jello"></i>
      </span>

      <span>{{ notification.message }}</span>

      <button class="close-btn" @click="notificationStore.hide(notification.id)"><i class="fa-solid fa-x fa-jello"></i></button>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.notification-container {
  position: fixed;

  top: 24px;

  right: 24px;

  display: flex;

  flex-direction: column;

  gap: 12px;

  z-index: 9999;
}
.notification {
  min-width: 340px;

  max-width: 420px;

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

  display: flex;

  align-items: center;

  justify-content: center;
}

.close-btn {
  margin-left: auto;

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
</style>
