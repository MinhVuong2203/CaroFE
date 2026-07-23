<script setup>
import { playPlaceSound } from '@/services/audio'
import { connection } from '@/services/signalr'
import { useNotificationStore } from '@/stores/notificationStore'
import { useRoomStore } from '@/stores/roomStore'
import { getSignalRError } from '@/utils/signalr'
import { computed } from 'vue'

const roomStore = useRoomStore()
const notification = useNotificationStore()
const board = computed(() => roomStore.room.board)

const isWinningCell = (row, col) => {
  return roomStore.room.winningCells?.some((cell) => cell.row === row && cell.col === col)
}

const placePiece = async (row, col) => {
  try {
    await connection.invoke('PlacePiece', {
      roomCode: roomStore.room.roomCode,
      row,
      col,
    })
    playPlaceSound()
  } catch (err) {
    notification.error(getSignalRError(err), 3000)
  }
}

const isLastMove = (row, col) => {
  return roomStore.room.lastMove?.row === row && roomStore.room.lastMove?.col === col
}
</script>

<template>
  <div class="board-wrapper">
    <div class="board-header">
      <div class="board-title">
        <i class="fa-solid fa-chess-board board-icon"></i>
        <h2>
          Cuộc chiến giữa <span class="piece-x">{{ roomStore.room.player1?.name }}</span> và
          <span class="piece-o">{{ roomStore.room.player2?.name }}</span>
        </h2>
      </div>
      <div class="board-meta">
        <i class="fa-solid fa-table-cells board-size-icon"></i>
        <span class="board-size">
          {{ roomStore.room.boardSize }} × {{ roomStore.room.boardSize }}
        </span>
      </div>
    </div>

    <div
      class="board-grid"
      :style="{
        gridTemplateColumns: `repeat(${roomStore.room.boardSize}, 1fr)`,
      }"
    >
      <template v-for="(row, rowIndex) in board" :key="rowIndex">
        <div
          v-for="(cell, colIndex) in row"
          :key="`${rowIndex}-${colIndex}`"
          class="board-cell"
          :class="{
            winner: isWinningCell(rowIndex, colIndex),
            'cell-x': cell === 'X',
            'cell-o': cell === 'O',
            empty: !cell,
          }"
          @click="placePiece(rowIndex, colIndex)"
        >
          <!-- X piece -->
          <i
            v-if="cell === 'X'"
            class="fa-solid fa-x piece-icon piece-x"
            :class="{ 'fa-jello ': isLastMove(rowIndex, colIndex) }"
          ></i>

          <!-- O piece -->
          <i
            v-else-if="cell === 'O'"
            class="fa-solid fa-o piece-icon piece-o"
            :class="{ 'fa-jello': isLastMove(rowIndex, colIndex) }"
          ></i>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ── Wrapper ── */
.board-wrapper {
  width: 100%;
  background: linear-gradient(
    160deg,
    var(--surface) 0%,
    color-mix(in srgb, var(--surface) 80%, #0f172a) 100%
  );
  border: 1.5px solid var(--border);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow:
    var(--shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

/* ambient corner glow */
.board-wrapper::after {
  content: '';
  position: absolute;
  bottom: -40px;
  right: -40px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Header ── */
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.board-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.board-icon {
  font-size: 18px;
  color: var(--primary);
  opacity: 0.85;
}

.board-title h2 {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.board-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  background: color-mix(in srgb, var(--surface-hover) 80%, transparent);
  border: 1px solid var(--border);
  padding: 5px 12px;
  border-radius: 999px;
}

.board-size-icon {
  font-size: 12px;
  color: var(--text-secondary);
}

.board-size {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* ── Grid ── */
.board-grid {
  display: grid;
  gap: 3px;
  aspect-ratio: 1;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  background: color-mix(in srgb, var(--border) 70%, transparent);
  padding: 3px;
  border-radius: 14px;
  border: 1px solid var(--border);
}

/* ── Cell ── */
.board-cell {
  aspect-ratio: 1;
  background: var(--surface);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition:
    background 0.15s,
    transform 0.15s;
  border-radius: 4px;
  position: relative;
}

.board-cell.empty:hover {
  background: color-mix(in srgb, var(--primary) 12%, var(--surface));
  transform: scale(1.04);
}

.board-cell.empty:hover::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 4px;
  border: 1.5px solid rgba(59, 130, 246, 0.25);
}

.board-cell:active {
  transform: scale(0.93);
}

/* ── Piece Icons ── */
.piece-icon {
  font-size: clamp(12px, 3.5vw, 26px);
  line-height: 1;
}

.piece-x {
  color: #3b82f6;
  filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.5));
  font-weight: 900;
}

.piece-o {
  color: #ec4899;
  filter: drop-shadow(0 0 4px rgba(236, 72, 153, 0.5));
}

.last-piece {
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
  transform-origin: center;
  filter: drop-shadow(0 0 8px currentColor);
}

@keyframes pop-in {
  from {
    opacity: 0;
    transform: scale(0.4) rotate(-15deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* ── Winner Cells ── */
.board-cell.winner {
  background: linear-gradient(135deg, #fef08a, #fde047);
  animation: winner-pulse 0.75s ease-in-out infinite alternate;
  border-radius: 6px;
  z-index: 1;
}

.board-cell.winner .piece-x {
  color: #1d4ed8;
  filter: drop-shadow(0 0 6px rgba(29, 78, 216, 0.7));
}

.board-cell.winner .piece-o {
  color: #be185d;
  filter: drop-shadow(0 0 6px rgba(190, 24, 93, 0.7));
}

@keyframes winner-pulse {
  from {
    transform: scale(1);
    box-shadow: 0 0 0px rgba(253, 224, 71, 0);
  }
  to {
    transform: scale(1.1);
    box-shadow: 0 0 16px rgba(253, 224, 71, 0.6);
  }
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .board-wrapper {
    padding: 16px;
  }
  .board-grid {
    max-width: 100%;
    gap: 2px;
    padding: 2px;
  }
  .board-title h2 {
    font-size: 17px;
  }
}

@media (max-width: 560px) {
  .board-wrapper {
    padding: 10px;
    border-radius: 18px;
    gap: 12px;
  }

  .board-title h2 {
    font-size: 15px;
  }

  .board-icon {
    font-size: 15px;
  }

  .board-meta {
    padding: 4px 9px;
  }

  .board-size {
    font-size: 11px;
  }

  .board-grid {
    gap: 1.5px;
    padding: 1.5px;
    border-radius: 10px;
  }

  .board-cell,
  .board-cell.winner {
    border-radius: 3px;
  }
}
</style>
