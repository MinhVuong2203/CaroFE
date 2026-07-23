<script setup>
import { useRoomStore } from '@/stores/roomStore'

const props = defineProps({
  selectedConnectionId: String,
})

const emit = defineEmits(['select'])

const roomStore = useRoomStore()
</script>

<template>
  <div v-if="roomStore.room.viewers.length" class="viewer-list">
    <div class="viewer-header">
      <i class="fa-solid fa-eye"></i>
      <span>Khán giả ({{ roomStore.room.viewers.length }})</span>
    </div>

    <div class="viewer-grid">
      <div
        v-for="viewer in roomStore.room.viewers"
        :key="viewer.connectionId"
        class="viewer-card"
        :class="{
          selected: selectedConnectionId === viewer.connectionId,
        }"
        @click="emit('select', viewer.connectionId)"
      >
        <i class="fa-solid fa-user"></i>

        <span>{{ viewer.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.viewer-list {
  margin-top: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.viewer-header {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-bottom: 14px;

  font-weight: 700;
  color: var(--text-secondary);
}

.viewer-grid {
  display: flex;
  justify-content: center;
  align-items: center;

  flex-wrap: wrap;

  gap: 12px;

  width: 100%;
}

.viewer-card {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 10px 16px;

  border-radius: 14px;

  background: var(--surface);

  border: 1px solid var(--border);

  cursor: pointer;

  transition: all 0.25s ease;

  user-select: none;
}

.viewer-card:hover {
  transform: translateY(-2px);

  background: var(--surface-hover);

  border-color: var(--primary);
}

.viewer-card.selected {
  border: 2px solid var(--primary);

  background: color-mix(in srgb, var(--primary) 15%, var(--surface));

  box-shadow: 0 0 18px color-mix(in srgb, var(--primary) 45%, transparent);

  transform: scale(1.06);
}

.viewer-card.selected i {
  color: var(--primary);
}

.viewer-card.selected span {
  font-weight: 700;
}
</style>
