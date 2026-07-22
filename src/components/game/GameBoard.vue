<script setup>
import { useRoomStore } from '@/stores/roomStore'
import { computed } from 'vue'

// const BOARD_SIZE = 15
const roomStore = useRoomStore()

const cells = computed(() => {
  return Array.from({ length: roomStore.boardSize * roomStore.boardSize }, (_, index) => ({
    id: index,
    value: '',
  }))
})
</script>

<template>
  <div class="board-wrapper">
    <div class="board-header">
      <h2>Bàn cờ</h2>

      <span class="board-size"> {{ roomStore.boardSize }} × {{ roomStore.boardSize }} </span>
    </div>

    <div
      class="board-grid"
      :style="{
        gridTemplateColumns: `repeat(${roomStore.boardSize}, 1fr)`,
      }"
    >
      <div v-for="cell in cells" :key="cell.id" class="board-cell">
        {{ cell.value }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-wrapper {
  width: 100%;
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 20px;

  padding: 24px;

  display: flex;

  flex-direction: column;

  gap: 20px;

  box-shadow: var(--shadow);
}

.board-header {
  display: flex;

  justify-content: space-between;

  align-items: center;
}

.board-header h2 {
  font-size: 22px;

  font-weight: 700;
}

.board-size {
  color: var(--text-secondary);

  font-size: 14px;
}

.board-grid {
  display: grid;

  gap: 2px;

  aspect-ratio: 1;

  width: 100%;

  max-width: 720px;

  margin: 0 auto;

  background: var(--border);

  padding: 2px;

  border-radius: 12px;
}

.board-cell {
  aspect-ratio: 1;

  background: var(--surface);

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 22px;

  font-weight: bold;

  cursor: pointer;

  user-select: none;

  transition:
    background 0.15s,
    transform 0.15s;
}

.board-cell:hover {
  background: rgba(59, 130, 246, 0.15);

  transform: scale(1.05);
}

.board-cell:active {
  transform: scale(0.95);
}

@media (max-width: 900px) {
  .board-wrapper {
    padding: 16px;
  }

  .board-grid {
    max-width: 100%;
  }
}
</style>
