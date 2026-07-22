<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'O',
  },

  name: {
    type: String,
    default: '???',
  },

  status: {
    type: String,
    default: 'waiting',
  },

  isTurn: {
    type: Boolean,
    default: false,
  },

  isHost: {
    type: Boolean,
    default: false,
  },
})

const statusText = computed(() => {
  switch (props.status) {
    case 'online':
      return 'Online'

    case 'waiting':
      return 'Đang chờ'

    case 'offline':
      return 'Offline'

    default:
      return 'Unknown'
  }
})

const statusClass = computed(() => {
  return props.status
})
</script>

<template>
  <div class="player-card" :class="{ active: isTurn }">
    <div v-if="props.isHost" class="host-indicator">👑</div>
    <div class="player-piece" :class="props.type">
      {{ props.type }}
    </div>

    <div class="player-avatar">👤</div>

    <div class="player-name">
      {{ props.name }}
    </div>

    <div class="player-status" :class="statusClass">● {{ statusText }}</div>

    <div v-if="props.isTurn" class="player-turn">🎯 Đến lượt</div>
  </div>
</template>

<style scoped>
.player-card {
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 18px;

  padding: 20px;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 12px;

  transition: 0.25s;
}

.player-card.active {
  border-color: var(--primary);

  box-shadow: 0 0 18px rgba(59, 130, 246, 0.25);
}

.player-piece {
  width: 52px;

  height: 52px;

  border-radius: 50%;

  display: flex;

  justify-content: center;

  align-items: center;

  color: white;

  font-size: 24px;

  font-weight: bold;
}

.player-piece.X {
  background: #3b82f6;
}

.player-piece.O {
  background: #ec4899;
}

.player-avatar {
  width: 72px;

  height: 72px;

  border-radius: 50%;

  background: var(--surface-hover);

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 34px;
}

.player-name {
  font-size: 18px;

  font-weight: 700;
}

.player-status {
  font-size: 14px;

  font-weight: 600;
}

.player-status.online {
  color: #22c55e;
}

.player-status.waiting {
  color: #f59e0b;
}

.player-status.offline {
  color: #ef4444;
}

.player-turn {
  margin-top: 8px;

  padding: 6px 14px;

  border-radius: 999px;

  background: var(--primary);

  color: white;

  font-size: 14px;

  font-weight: 600;
}
</style>
