<script setup>
import { useRoomStore } from '@/stores/roomStore'

const roomStore = useRoomStore() // hàm này được gọi để lấy dữ liệu từ store roomStore trong roomStore.js đã export ra

const copyRoomCode = async () => {
  try {
    await navigator.clipboard.writeText(roomStore.room.roomCode)
    alert('Đã sao chép mã phòng.')
  } catch {
    alert('Không thể sao chép.')
  }
}

// const playerCount = computed(() => {
//   return roomStore.room.players.length
// })
</script>

<template>
  <div class="room-card">
    <h3 class="card-title">Thông tin phòng</h3>

    <div class="room-code-box">
      <span class="room-code">
        {{ roomStore.room.roomCode }}
      </span>

      <button class="copy-btn" @click="copyRoomCode">📋</button>
    </div>

    <div class="info-list">
      <div class="info-item">
        <span>👥 Người chơi</span>
        <strong>{{ roomStore.getQuantityPlayer }}/2</strong>
      </div>

      <div class="info-item">
        <span>🧩 Bàn cờ</span>
        <strong>{{ roomStore.room.boardSize }}x{{ roomStore.room.boardSize }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-card {
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 18px;

  padding: 20px;

  display: flex;

  flex-direction: column;

  gap: 18px;
}

.card-title {
  text-align: center;

  font-size: 18px;

  font-weight: 700;
}

.room-code-box {
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 12px;
}

.room-code {
  font-size: 28px;

  font-weight: 800;

  letter-spacing: 4px;

  color: var(--primary);
}

.copy-btn {
  border: none;

  background: var(--primary);

  color: white;

  width: 36px;

  height: 36px;

  border-radius: 10px;

  cursor: pointer;

  transition: 0.2s;
}

.copy-btn:hover {
  transform: scale(1.08);
}

.info-list {
  display: flex;

  flex-direction: column;

  gap: 12px;
}

.info-item {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 10px 12px;

  background: var(--surface-hover);

  border-radius: 10px;
}

.info-item span {
  color: var(--text-secondary);
}
</style>
