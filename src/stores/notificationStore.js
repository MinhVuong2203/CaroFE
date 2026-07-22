import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  const show = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()

    notifications.value.push({
      id,
      message,
      type,
    })

    setTimeout(() => {
      hide(id)
    }, duration)
  }

  const hide = (id) => {
    notifications.value = notifications.value.filter((notification) => notification.id !== id)
  }

  const success = (message, duration = 3000) => {
    show(message, 'success', duration)
  }

  const error = (message, duration = 3000) => {
    show(message, 'error', duration)
  }

  const warning = (message, duration = 3000) => {
    show(message, 'warning', duration)
  }

  const info = (message, duration = 3000) => {
    show(message, 'info', duration)
  }

  return {
    notifications,

    success,
    error,
    warning,
    info,

    hide,
  }
})
