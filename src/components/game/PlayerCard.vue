<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'O',
  },
  name: {
    type: String,
    default: '???',
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
</script>

<template>
  <div
    class="player-card"
    :class="{
      active: isTurn,
      activeX: isTurn && props.type === 'X',
      activeO: isTurn && props.type === 'O',
    }"
  >
    <!-- Host crown -->
    <div v-if="props.isHost" class="host-badge">
      <i class="fa-solid fa-crown"></i>
      <span>Host</span>
    </div>

    <!-- Piece badge -->
    <div class="piece-badge" :class="props.type">
      <i v-if="props.type === 'X'" class="fa-solid fa-xmark"></i>
      <i v-else class="fa-regular fa-circle"></i>
    </div>

    <!-- Avatar -->
    <div class="player-avatar">
      <i class="fa-solid fa-user"></i>
      <!-- Turn glow ring -->
      <div v-if="isTurn" class="turn-ring" :class="props.type"></div>
    </div>

    <!-- Name -->
    <div class="player-name">{{ props.name }}</div>
  </div>
</template>

<style scoped>
.player-card {
  position: relative;
  background: linear-gradient(
    160deg,
    var(--surface) 0%,
    color-mix(in srgb, var(--surface) 85%, #1e293b) 100%
  );
  border: 1.5px solid var(--border);
  border-radius: 22px;
  padding: 28px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  height: 100%;
}

/* Subtle top shimmer line */
.player-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  border-radius: 999px;
}

.player-card.activeX {
  border-color: #3b82f6;
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.25),
    0 0 28px rgba(59, 130, 246, 0.3),
    0 8px 32px rgba(0, 0, 0, 0.25);
}

.player-card.activeO {
  border-color: #ec4899;
  box-shadow:
    0 0 0 1px rgba(236, 72, 153, 0.25),
    0 0 28px rgba(236, 72, 153, 0.3),
    0 8px 32px rgba(0, 0, 0, 0.25);
}

/* ── Host Badge ── */
.host-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #78350f;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 9px 3px 6px;
  border-radius: 999px;
  letter-spacing: 0.03em;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.host-badge i {
  font-size: 11px;
}

/* ── Piece Badge ── */
.piece-badge {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 900;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.piece-badge.X {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.piece-badge.O {
  background: linear-gradient(135deg, #db2777, #ec4899);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

/* ── Avatar ── */
.player-avatar {
  position: relative;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(
    145deg,
    var(--surface-hover),
    color-mix(in srgb, var(--surface-hover) 60%, #0f172a)
  );
  border: 2px solid var(--border);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  color: var(--text-secondary);
  margin: 4px 0;
}

.turn-ring {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 2.5px solid transparent;
  animation: spin-ring 2.5s linear infinite;
}

.turn-ring.X {
  border-top-color: #3b82f6;
  border-right-color: rgba(59, 130, 246, 0.3);
}

.turn-ring.O {
  border-top-color: #ec4899;
  border-right-color: rgba(236, 72, 153, 0.3);
}

@keyframes spin-ring {
  to {
    transform: rotate(360deg);
  }
}

/* ── Name ── */
.player-name {
  font-size: 17px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: 0.01em;
  text-align: center;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Status ── */
.player-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.status-dot {
  font-size: 7px;
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

/* ── Turn Label ── */
.turn-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: white;
  white-space: nowrap;
}

.turn-label.X {
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  box-shadow: 0 3px 12px rgba(59, 130, 246, 0.45);
}

.turn-label.O {
  background: linear-gradient(135deg, #be185d, #ec4899);
  box-shadow: 0 3px 12px rgba(236, 72, 153, 0.45);
}

.turn-label i {
  font-size: 12px;
  animation: bolt-pulse 1s ease-in-out infinite alternate;
}

@keyframes bolt-pulse {
  from {
    opacity: 0.6;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1.15);
  }
}

/* =========================================================
   RESPONSIVE
   ========================================================= */

/* Tablet: cards sit side by side, shrink padding a touch */
@media (max-width: 1024px) {
  .player-card {
    padding: 22px 14px 16px;
    border-radius: 18px;
  }

  .player-avatar {
    width: 64px;
    height: 64px;
    font-size: 26px;
  }
}

/* Mobile: compact horizontal-friendly card */
@media (max-width: 560px) {
  .player-card {
    padding: 16px 10px 12px;
    border-radius: 16px;
    gap: 6px;
  }

  .host-badge {
    top: 8px;
    right: 8px;
    font-size: 9px;
    padding: 2px 7px 2px 5px;
  }

  .piece-badge {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .player-avatar {
    width: 48px;
    height: 48px;
    font-size: 20px;
    margin: 2px 0;
  }

  .player-name {
    font-size: 13px;
    max-width: 100px;
  }

  .turn-label {
    font-size: 10px;
    padding: 3px 8px;
  }

  .turn-label-text {
    display: none;
  }
}
</style>
