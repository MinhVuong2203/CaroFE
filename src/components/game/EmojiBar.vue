<script setup>
const emit = defineEmits(['select'])

const emojis = ['😀', '😂', '🤣', '😍', '😎', '🥳', '😢', '😡', '👍', '👎', '👏', '❤️']

const sendEmoji = (emoji) => {
  emit('select', emoji)

  // Sau này:
  // await connection.invoke("SendEmoji", roomCode, emoji);
}
</script>

<template>
  <div class="emoji-card">
    <div class="emoji-header">
      <span>⚡ Phản ứng nhanh</span>
    </div>

    <div class="emoji-grid">
      <button v-for="emoji in emojis" :key="emoji" class="emoji-btn" @click="sendEmoji(emoji)">
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.emoji-card {
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 18px;

  padding: 16px;

  display: flex;

  flex-direction: column;

  gap: 16px;

  box-shadow: var(--shadow);
}

.emoji-header {
  font-size: 17px;

  font-weight: 700;
}

.emoji-grid {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 10px;
}

.emoji-btn {
  width: 56px;

  height: 56px;

  border: none;

  border-radius: 14px;

  background: var(--surface-hover);

  font-size: 28px;

  cursor: pointer;

  transition: 0.2s;
}

.emoji-btn:hover {
  transform: translateY(-3px) scale(1.1);

  background: var(--primary);
}

.emoji-btn:active {
  transform: scale(0.9);
}
</style>
