<script setup>
import { connection } from '@/services/signalr'
import { useNotificationStore } from '@/stores/notificationStore'
import { useRoomStore } from '@/stores/roomStore'
import { getSignalRError } from '@/utils/signalr'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '../common/AppButton.vue'
import ThemeToggle from '../common/ThemeToggle.vue'
import Swal from 'sweetalert2'
import SettingsPanel from './SettingsPanel.vue'

const router = useRouter()
const notification = useNotificationStore()
const roomStore = useRoomStore()

const showSettings = ref(false)

const copyRoomCode = async () => {
  try {
    await navigator.clipboard.writeText(roomStore.room.roomCode)
    notification.success('Đã sao chép mã phòng.', 3000)
  } catch {
    notification.error('Không thể sao chép mã phòng.', 3000)
  }
}

const leaveRoom = async () => {
  const result = await Swal.fire({
    title: 'Rời phòng?',
    html: `
      <div style="font-size:15px;color:var(--text-secondary)">
        <i class="fa-solid fa-right-from-bracket"
           style="font-size:48px;color:#ef4444;margin-bottom:16px;"></i>

        <p>Bạn có chắc muốn rời phòng?</p>

        <small>Tiến trình hiện tại sẽ bị mất.</small>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: '<i class="fa-solid fa-door-open"></i> Rời phòng',
    cancelButtonText: '<i class="fa-solid fa-xmark"></i> Ở lại',
    buttonsStyling: false,
    customClass: {
      popup: 'swal-popup',
      confirmButton: 'swal-confirm',
      cancelButton: 'swal-cancel',
    },
  })

  if (!result.isConfirmed) return

  try {
    await connection.invoke('LeaveRoom', roomStore.room.roomCode)

    localStorage.removeItem('caro-session')
    roomStore.clearRoom()

    router.push('/')
  } catch (err) {
    console.error(err)
  }
}

// =====================
// Role
// =====================

const isHost = computed(() => {
  return roomStore.room.hostConnectionId === connection.connectionId
})

const isPlayer1 = computed(() => {
  return roomStore.room.player1?.connectionId === connection.connectionId
})

const isPlayer2 = computed(() => {
  return roomStore.room.player2?.connectionId === connection.connectionId
})

const isPlayer = computed(() => {
  return isPlayer1.value || isPlayer2.value
})

const isViewer = computed(() => {
  return !isPlayer.value
})

// =====================
// Button
// =====================

const buttonDisabled = computed(() => {
  return isViewer.value && !isHost.value
})

const toggleReady = async () => {
  try {
    await connection.invoke('ToggleReady', roomStore.room.roomCode)
  } catch (err) {
    notification.error(getSignalRError(err), 3000)
  }
}

const buttonText = computed(() => {
  if (roomStore.room.isPlaying) {
    return 'Dừng'
  }

  if (isViewer.value && isHost.value) {
    return roomStore.room.isPlaying ? 'Dừng' : 'Điều khiển'
  }

  const ready = isPlayer1.value ? roomStore.room.player1Ready : roomStore.room.player2Ready

  return ready ? 'Hủy sẵn sàng' : 'Sẵn sàng'
})

const buttonIcon = computed(() => {
  if (roomStore.room.isPlaying) {
    return 'fa-solid fa-stop'
  }

  if (!isPlayer.value) {
    return 'fa-solid fa-check'
  }

  const ready = isPlayer1.value ? roomStore.room.player1Ready : roomStore.room.player2Ready

  return ready ? 'fa-solid fa-xmark' : 'fa-solid fa-check'
})

const buttonClass = computed(() => {
  if (roomStore.room.isPlaying) {
    return 'danger'
  }

  if (!isPlayer.value) {
    return 'success'
  }

  const ready = isPlayer1.value ? roomStore.room.player1Ready : roomStore.room.player2Ready

  return ready ? 'warning' : 'success'
})

// yêu cầu hòa
const requestDraw = async () => {
  try {
    await connection.invoke('RequestDraw', roomStore.room.roomCode)

    notification.success('Đã gửi yêu cầu hòa.', 3000)
  } catch (err) {
    notification.error(getSignalRError(err), 3000)
  }
}
</script>

<template>
  <header class="game-header">
    <AppButton class="header-btn danger" @click="leaveRoom">
      <span class="btn-full">← Thoát</span>
      <span class="btn-compact">
        <i class="fa-solid fa-arrow-left"></i>
      </span>
    </AppButton>

    <div class="room-section">
      <div class="room-code">
        {{ roomStore.room.roomCode }}

        <AppButton class="copy-btn" @click="copyRoomCode" title="Sao chép mã phòng">
          <i class="fa-regular fa-copy fa-float"></i>
        </AppButton>
      </div>

      <span class="player-count">
        <i class="fa-solid fa-people-pulling"></i> {{ roomStore.getQuantityPlayer }}/2
      </span>
    </div>

    <div class="header-actions">
      <AppButton
        class="header-btn"
        :class="buttonClass"
        :disabled="buttonDisabled"
        :title="buttonDisabled ? 'Viewer không thể thao tác' : ''"
        @click="toggleReady"
      >
        <i :class="buttonIcon"></i>

        <span class="btn-full">
          {{ buttonText }}
        </span>
      </AppButton>

      <AppButton
        v-if="isPlayer && roomStore.room.isPlaying"
        class="header-btn warning"
        @click="requestDraw"
      >
        <i class="fa-solid fa-handshake"></i>
        <span class="btn-full">Cầu hòa</span>
      </AppButton>

      <ThemeToggle />

      <AppButton class="theme-toggle" @click="showSettings = true">
        <i class="fa-solid fa-wrench"></i>
      </AppButton>

      <SettingsPanel v-if="showSettings" @close="showSettings = false" />
    </div>
  </header>
</template>

<style scoped>
.game-header {
  padding: 6px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.room-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.room-title {
  font-size: 16px;
  color: var(--text-secondary);
  padding-top: 5px;
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
  color: var(--text);
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
  white-space: nowrap;
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

.btn-compact {
  display: none;
}

.theme-toggle {
  width: 42px;

  height: 42px;

  border: none;

  border-radius: 50%;

  cursor: pointer;

  font-size: 20px;

  background: var(--surface-hover);

  color: var(--text);

  transition: 0.25s;
}

.theme-toggle:hover {
  transform: rotate(20deg) scale(1.08);
}

/* =========================================================
   RESPONSIVE
   ========================================================= */

/* Tablet */
@media (max-width: 1024px) {
  .game-header {
    height: 64px;
    padding: 0 16px;
  }

  .room-code {
    font-size: 20px;
    letter-spacing: 2px;
  }

  .header-btn {
    min-width: 90px;
    height: 38px;
    font-size: 13px;
  }
}

/* Mobile: icon-only buttons, compact room code */
@media (max-width: 560px) {
  .game-header {
    height: 56px;
    padding: 0 10px;
    gap: 6px;
  }

  .room-title,
  .player-count {
    display: none;
  }

  .room-code {
    font-size: 16px;
    letter-spacing: 1px;
    gap: 6px;
  }

  .copy-btn {
    font-size: 14px;
  }

  .header-btn {
    min-width: 0;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 10px;
  }

  .btn-full {
    display: none;
  }

  .btn-compact {
    display: inline-flex;
  }

  .header-btn.icon-only {
    font-size: 16px;
  }
}
</style>
