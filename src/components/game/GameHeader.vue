<script setup>
import { connection } from '@/services/signalr'
import { useNotificationStore } from '@/stores/notificationStore'
import { useRoomStore } from '@/stores/roomStore'
import { getSignalRError } from '@/utils/signalr'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const notification = useNotificationStore()

const roomStore = useRoomStore()
// const playerCount = 1

const copyRoomCode = async () => {
  try {
    await navigator.clipboard.writeText(roomStore.room.roomCode)
    alert('Đã sao chép mã phòng.')
  } catch {
    alert('Không thể sao chép.')
  }
}

const leaveRoom = async () => {
  if (confirm('Bạn có muốn rời phòng không?')) {
    try {
      await connection.invoke('LeaveRoom', roomStore.room.roomCode) // Xóa trong RAM BE
      localStorage.removeItem('caro-session') // Xóa session khi rời phòng
      roomStore.clearRoom() // Xóa dữ liệu phòng trong store
      router.push('/')
    } catch (err) {
      console.error('Error leaving room:', err)
    }
  }
}

const toggleGame = async () => {
  try {
    if (roomStore.room.winningCells.length > 0) {
      await connection.invoke('RestartGame', roomStore.room.roomCode)
    } else if (roomStore.room.isPlaying) {
      await connection.invoke('StopGame', roomStore.room.roomCode)
    } else {
      await connection.invoke('StartGame', roomStore.room.roomCode)
    }
  } catch (err) {
    notification.error(getSignalRError(err), 3000)
  }
}

const buttonText = computed(() => {
  if (roomStore.room.winningCells.length > 0) return 'Đánh lại'
  return roomStore.room.isPlaying ? 'Dừng lại' : 'Bắt đầu'
})

const buttonIcon = computed(() => {
  if (roomStore.room.winningCells.length > 0) return 'fa-solid fa-rotate-right'

  return roomStore.room.isPlaying ? 'fa-solid fa-stop' : 'fa-solid fa-play'
})

const buttonClass = computed(() => {
  if (roomStore.room.winningCells.length > 0) return 'warning'

  return roomStore.room.isPlaying ? 'danger' : 'success'
})
</script>

<template>
  <header class="game-header">
    <button class="header-btn danger" @click="leaveRoom">← Thoát</button>

    <div class="room-section">
      <span class="room-title"> Phòng </span>

      <div class="room-code">
        {{ roomStore.room.roomCode }}

        <button class="copy-btn" @click="copyRoomCode" title="Sao chép mã phòng">📋</button>
      </div>

      <span class="player-count"> 👥 {{ roomStore.getQuantityPlayer }}/2 </span>
    </div>

    <div class="header-actions">
      <button
        class="header-btn"
        :class="buttonClass"
        :disabled="roomStore.room.hostConnectionId !== connection.connectionId"
        :title="
          roomStore.room.hostConnectionId !== connection.connectionId
            ? 'Chỉ chủ phòng mới có thể chạm vào'
            : ''
        "
        @click="toggleGame"
      >
        <i :class="buttonIcon"></i>
        {{ buttonText }}
      </button>

      <button class="header-btn">⚙️</button>
    </div>
  </header>
</template>

<style scoped>
.game-header {
  height: 72px;

  padding: 0 24px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  background: var(--surface);

  border-bottom: 1px solid var(--border);

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.room-section {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 4px;
}

.room-title {
  font-size: 13px;

  color: var(--text-secondary);
}

.room-code {
  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 24px;

  font-weight: 700;

  letter-spacing: 3px;
}

.copy-btn {
  background: none;

  border: none;

  cursor: pointer;

  font-size: 18px;

  transition: 0.2s;
}

.copy-btn:hover {
  transform: scale(1.15);
}

.player-count {
  font-size: 13px;

  color: var(--text-secondary);
}

.header-actions {
  display: flex;

  align-items: center;

  gap: 12px;
}

.header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 110px;

  height: 42px;

  border: none;

  border-radius: 10px;

  background: var(--surface-hover);

  color: var(--text);

  font-weight: 600;

  cursor: pointer;

  transition: 0.25s;
}

.header-btn:hover {
  transform: translateY(-2px);
}

.header-btn.danger {
  background: #ef4444;

  color: white;
}

.header-btn.danger:hover {
  background: #dc2626;
}

.header-btn.success {
  background: #22c55e;
  color: white;
}

.header-btn.success:hover {
  background: #16a34a;
}

.header-btn.warning {
  background: #f59e0b;
  color: white;
}

.header-btn.warning:hover {
  background: #d97706;
}

.header-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.header-btn:disabled:hover {
  transform: none;
}
</style>
