<script setup>
import { computed, ref } from 'vue'

const message = ref('')

const messages = ref([
  {
    id: 1,
    sender: 'Bạn',
    content: 'Chào bạn 👋',
    time: '10:15',
    mine: true,
  },
  {
    id: 2,
    sender: 'Đối thủ',
    content: 'Hello 😄',
    time: '10:16',
    mine: false,
  },
])

const canSend = computed(() => message.value.trim().length > 0)

const sendMessage = () => {
  if (!canSend.value) return

  messages.value.push({
    id: Date.now(),
    sender: 'Bạn',
    content: message.value,
    time: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    mine: true,
  })

  message.value = ''
}
</script>

<template>
  <div class="chat-card">
    <div class="chat-header">💬 Chat</div>

    <div class="chat-body">
      <div v-for="item in messages" :key="item.id" class="chat-item" :class="{ mine: item.mine }">
        <div class="chat-sender">
          {{ item.sender }}
        </div>

        <div class="chat-bubble">
          {{ item.content }}
        </div>

        <div class="chat-time">
          {{ item.time }}
        </div>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="message"
        type="text"
        maxlength="200"
        placeholder="Nhập tin nhắn..."
        @keyup.enter="sendMessage"
      />

      <button :disabled="!canSend" @click="sendMessage">Gửi</button>
    </div>
  </div>
</template>

<style scoped>
.chat-card {
  height: 100%;

  display: flex;

  flex-direction: column;

  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 18px;

  overflow: hidden;

  box-shadow: var(--shadow);
}

.chat-header {
  padding: 16px;

  font-size: 18px;

  font-weight: 700;

  border-bottom: 1px solid var(--border);
}

.chat-body {
  flex: 1;

  overflow-y: auto;

  padding: 16px;

  display: flex;

  flex-direction: column;

  gap: 14px;
}

.chat-item {
  display: flex;

  flex-direction: column;

  max-width: 80%;
}

.chat-item.mine {
  align-self: flex-end;
}

.chat-item:not(.mine) {
  align-self: flex-start;
}

.chat-sender {
  font-size: 12px;

  color: var(--text-secondary);

  margin-bottom: 4px;
}

.chat-bubble {
  padding: 10px 14px;

  border-radius: 14px;

  background: var(--surface-hover);

  word-break: break-word;
}

.chat-item.mine .chat-bubble {
  background: var(--primary);

  color: white;
}

.chat-time {
  margin-top: 4px;

  font-size: 11px;

  color: var(--text-secondary);
}

.chat-item.mine .chat-time {
  text-align: right;
}

.chat-input {
  display: flex;

  gap: 10px;

  padding: 16px;

  border-top: 1px solid var(--border);
}

.chat-input input {
  flex: 1;

  border: 1px solid var(--border);

  border-radius: 10px;

  padding: 10px 14px;

  background: var(--surface);

  color: var(--text);

  outline: none;
}

.chat-input input:focus {
  border-color: var(--primary);
}

.chat-input button {
  padding: 10px 18px;

  border: none;

  border-radius: 10px;

  background: var(--primary);

  color: white;

  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.chat-input button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.chat-input button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}
</style>
