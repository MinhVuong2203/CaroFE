<script setup>
import { computed, ref, watch } from 'vue'

import {
  getAudioSetting,
  setBGMVolume,
  setPlaceVolume,
  setWinVolume,
  setButtonVolume,
  playButtonSound,
} from '@/services/audio'
import AppButton from '../common/AppButton.vue'
import { useRoomStore } from '@/stores/roomStore.js'
import { connection } from '@/services/signalr.js'

const setting = getAudioSetting()
const roomStore = useRoomStore()

const bgmVolume = ref(setting.bgmVolume)
const placeVolume = ref(setting.placeVolume)
const winVolume = ref(setting.winVolume)
const buttonVolume = ref(setting.buttonVolume)

const myName = computed(() => {
  const connectionId = connection.connectionId

  if (roomStore.room.player1?.connectionId === connectionId) {
    return roomStore.room.player1.name
  }

  if (roomStore.room.player2?.connectionId === connectionId) {
    return roomStore.room.player2.name
  }

  const viewer = roomStore.room.viewers.find((v) => v.connectionId === connectionId)

  return viewer?.name ?? ''
})

/* ================== AVATAR CONFIG ================== */

// Icon nhóm Animal - FontAwesome Free (style solid)
// mỗi phần tử là class FontAwesome đầy đủ, dùng luôn làm giá trị gửi lên server
const iconList = ref([
  'fa-solid fa-cat',
  'fa-solid fa-dog',
  'fa-solid fa-crow',
  'fa-solid fa-dove',
  'fa-solid fa-dragon',
  'fa-solid fa-fish',
  'fa-solid fa-fish-fins',
  'fa-solid fa-frog',
  'fa-solid fa-hippo',
  'fa-solid fa-horse',
  'fa-solid fa-horse-head',
  'fa-solid fa-kiwi-bird',
  'fa-solid fa-otter',
  'fa-solid fa-paw',
  'fa-solid fa-spider',
  'fa-solid fa-feather',
  'fa-solid fa-feather-pointed',
  'fa-solid fa-worm',
  'fa-solid fa-shrimp',
  'fa-solid fa-locust',
  'fa-solid fa-mosquito',
  'fa-solid fa-bug',
  'fa-solid fa-bugs',
])

// Hiệu ứng có sẵn của FontAwesome (Free) - dùng thẳng class, không cần keyframes riêng
const animationList = ref([
  { label: 'None', class: '' },
  { label: 'Beat', class: 'fa-beat' },
  { label: 'Beat Fade', class: 'fa-beat-fade' },
  { label: 'Fade', class: 'fa-fade' },
  { label: 'Bounce', class: 'fa-bounce' },
  { label: 'Flip', class: 'fa-flip' },
  { label: 'Shake', class: 'fa-shake' },
  { label: 'Spin', class: 'fa-spin' },
  { label: 'Spin Reverse', class: 'fa-spin fa-spin-reverse' },
  { label: 'Spin Pulse', class: 'fa-spin-pulse' },
])

// TODO: đổ danh sách màu preset (hoặc dùng input color tự do bên dưới)
const colorList = ref(['#ff5252', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#607d8b'])

/* --- state avatar đã áp dụng (avatar thật đang hiển thị) --- */
const currentPlayer = computed(() => {
  const connectionId = connection.connectionId

  if (roomStore.room.player1?.connectionId === connectionId) return roomStore.room.player1
  if (roomStore.room.player2?.connectionId === connectionId) return roomStore.room.player2

  return roomStore.room.viewers.find((v) => v.connectionId === connectionId)
})

const appliedIcon = ref(currentPlayer.value?.avatarIcon ?? iconList.value[0] ?? 'fa-solid fa-paw')
const appliedAnimation = ref(currentPlayer.value?.avatarAnimation ?? '')
const appliedColor = ref(currentPlayer.value?.avatarColor ?? colorList.value[0])

const pendingIcon = ref(appliedIcon.value)
const pendingAnimation = ref(appliedAnimation.value)
const pendingColor = ref(appliedColor.value)

// đồng bộ khi server báo cập nhật (RoomUpdated -> roomStore.room đổi)
watch(
  currentPlayer,
  (p) => {
    if (!p) return
    appliedIcon.value = p.avatarIcon ?? appliedIcon.value
    appliedAnimation.value = p.avatarAnimation ?? appliedAnimation.value
    appliedColor.value = p.avatarColor ?? appliedColor.value

    // chỉ đồng bộ pending nếu người dùng chưa đang chỉnh dở (tránh ghi đè lựa chọn đang chọn)
    if (!hasChanges.value) {
      pendingIcon.value = appliedIcon.value
      pendingAnimation.value = appliedAnimation.value
      pendingColor.value = appliedColor.value
    }
  },
  { deep: true },
)

function selectIcon(iconClass) {
  pendingIcon.value = iconClass
  playButtonSound()
}

function selectAnimation(animClass) {
  pendingAnimation.value = animClass
  playButtonSound()
}

function selectColor(color) {
  pendingColor.value = color
  playButtonSound()
}

async function confirmAvatar() {
  await connection.invoke('UpdateAvatar', {
    roomCode: roomStore.room.roomCode,
    icon: pendingIcon.value,
    animation: pendingAnimation.value,
    color: pendingColor.value,
  })

  appliedIcon.value = pendingIcon.value
  appliedAnimation.value = pendingAnimation.value
  appliedColor.value = pendingColor.value

  playButtonSound()
}

function cancelAvatar() {
  // trả avatar đang hiển thị về lại trạng thái đã lưu (applied)
  pendingIcon.value = appliedIcon.value
  pendingAnimation.value = appliedAnimation.value
  pendingColor.value = appliedColor.value
  playButtonSound()
}

const hasChanges = computed(() => {
  return (
    pendingIcon.value !== appliedIcon.value ||
    pendingAnimation.value !== appliedAnimation.value ||
    pendingColor.value !== appliedColor.value
  )
})

defineEmits(['close'])
</script>

<template>
  <div class="settings-overlay">
    <div class="settings-panel">
      <AppButton class="close-btn" @click="$emit('close')">
        <i class="fa-solid fa-xmark"></i>
      </AppButton>

      <div class="profile">
        <div class="avatar">
          <i
            :class="[pendingIcon || 'fa-solid fa-user', pendingAnimation]"
            :style="{ color: pendingColor }"
          ></i>
        </div>

        <div class="profile-info">
          <div class="name">{{ myName }}</div>
          <div class="sub-title">
            <i class="fa-solid fa-gamepad"></i>
            Caro Online
          </div>
        </div>
      </div>

      <!-- ================== AVATAR SECTION ================== -->

      <div class="picker-group">
        <div class="picker-label">Icon</div>
        <div class="icon-list">
          <AppButton
            v-for="icon in iconList"
            :key="icon"
            class="icon-option"
            :class="{ active: pendingIcon === icon }"
            @click="selectIcon(icon)"
          >
            <i :class="icon"></i>
          </AppButton>
        </div>
      </div>

      <div class="picker-group">
        <div class="picker-label">Hiệu ứng</div>
        <div class="anim-list">
          <button
            v-for="anim in animationList"
            :key="anim.class"
            class="anim-option"
            :class="{ active: pendingAnimation === anim.class }"
            @click="selectAnimation(anim.class)"
          >
            {{ anim.label }}
          </button>
        </div>
      </div>

      <div class="picker-group">
        <div class="picker-label">Màu sắc</div>
        <div class="color-list">
          <button
            v-for="color in colorList"
            :key="color"
            class="color-option"
            :class="{ active: pendingColor === color }"
            :style="{ background: color }"
            @click="selectColor(color)"
          ></button>

          <input type="color" class="color-custom" v-model="pendingColor" />
        </div>
      </div>

      <div class="avatar-actions">
        <AppButton class="btn-cancel" @click="cancelAvatar" :disabled="!hasChanges">
          Hủy
        </AppButton>
        <AppButton class="btn-ok" @click="confirmAvatar" :disabled="!hasChanges"> OK </AppButton>
      </div>

      <!-- ================== AUDIO SECTION ================== -->
      <h3 class="title">
        <i class="fa-solid fa-gear"></i>
        Cài đặt
      </h3>

      <div class="setting-item">
        <label>
          <span><i class="fa-solid fa-volume"></i> Nhạc nền</span>
          <span>{{ bgmVolume }}%</span>
        </label>

        <input
          type="range"
          min="0"
          max="100"
          v-model="bgmVolume"
          @input="setBGMVolume(bgmVolume)"
          @click="playButtonSound()"
        />
      </div>

      <div class="setting-item">
        <label>
          <span><i class="fa-solid fa-volume"></i> Đặt quân</span>
          <span>{{ placeVolume }}%</span>
        </label>

        <input
          type="range"
          min="0"
          max="100"
          v-model="placeVolume"
          @input="setPlaceVolume(placeVolume)"
          @click="playButtonSound()"
        />
      </div>

      <div class="setting-item">
        <label>
          <span><i class="fa-solid fa-volume"></i> Chiến thắng</span>
          <span>{{ winVolume }}%</span>
        </label>

        <input
          type="range"
          min="0"
          max="100"
          v-model="winVolume"
          @input="setWinVolume(winVolume)"
          @click="playButtonSound()"
        />
      </div>

      <div class="setting-item">
        <label>
          <span><i class="fa-solid fa-volume"></i> Thao tác</span>
          <span>{{ buttonVolume }}%</span>
        </label>

        <input
          type="range"
          min="0"
          max="100"
          v-model="buttonVolume"
          @input="setButtonVolume(buttonVolume)"
          @click="playButtonSound()"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  display: flex;
  align-items: center;
  gap: 14px;

  margin-bottom: 24px;
  padding-bottom: 18px;

  border-bottom: 1px solid var(--modal-border);
}

.avatar {
  width: 66px;
  height: 66px;

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  background: var(--color-primary);
  border: 2px solid var(--modal-border);

  color: white;

  font-size: 24px;
}

.profile-info {
  flex: 1;
}

.name {
  font-size: 20px;
  font-weight: 700;
}

.sub-title {
  margin-top: 4px;

  font-size: 14px;

  opacity: 0.7;
}

.settings-overlay {
  position: fixed;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.45);

  backdrop-filter: blur(4px);

  z-index: 9999;
}

.settings-panel {
  position: relative;

  width: 420px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;

  padding: 28px;

  border-radius: 16px;

  background: var(--modal-bg);

  border: 1px solid var(--modal-border);

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);

  animation: popup 0.2s ease;
}

.close-btn {
  position: absolute;

  top: 14px;
  right: 14px;

  width: 36px;
  height: 36px;

  border: none;
  border-radius: 50%;

  background: transparent;

  cursor: pointer;

  font-size: 20px;

  transition: 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.title {
  margin: 0 0 24px;

  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 22px;
}

.setting-item {
  margin-bottom: 22px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item label {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 8px;

  font-weight: 600;
}

.setting-item input[type='range'] {
  width: 100%;
  cursor: pointer;
}

/* ================== AVATAR PICKER STYLES ================== */

.picker-group {
  margin-bottom: 18px;
}

.picker-label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
  opacity: 0.85;
}

.icon-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.icon-option {
  width: 40px;
  height: 40px;

  color: var(--text-secondary);
  border-radius: 10px;
  border: 1px solid var(--modal-border);

  background: transparent;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  cursor: pointer;

  transition: 0.15s;
}

.icon-option:hover {
  background: rgba(255, 255, 255, 0.08);
}

.icon-option.active {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.12);
}

.anim-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.anim-option {
  padding: 6px 12px;

  color: var(--text-secondary);
  border-radius: 8px;
  border: 1px solid var(--modal-border);

  background: transparent;

  font-size: 13px;
  cursor: pointer;

  transition: 0.15s;
}

.anim-option:hover {
  background: rgba(255, 255, 255, 0.08);
}

.anim-option.active {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.12);
}

.color-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.color-option {
  width: 28px;
  height: 28px;

  border-radius: 50%;
  border: 2px solid transparent;

  cursor: pointer;
}

.color-option.active {
  border-color: white;
  box-shadow: 0 0 0 2px var(--color-primary);
}

.color-custom {
  width: 28px;
  height: 28px;

  border: none;
  border-radius: 50%;
  padding: 0;

  cursor: pointer;
  background: transparent;
}

.avatar-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-bottom: 28px;
  padding-bottom: 18px;

  border-bottom: 1px solid var(--modal-border);
}

.btn-cancel,
.btn-ok {
  padding: 8px 18px;
  border-radius: 8px;
}

.btn-ok {
  background: var(--primary);
  color: white;
}

/* ================== AVATAR ANIMATIONS ================== */
/* Thêm animation mới: định nghĩa @keyframes rồi thêm class vào animationList */

.anim-pulse {
  animation: avatarPulse 1s ease-in-out infinite;
}

.anim-bounce {
  animation: avatarBounce 0.8s ease-in-out infinite;
}

.anim-spin {
  animation: avatarSpin 1.2s linear infinite;
}

.anim-shake {
  animation: avatarShake 0.5s ease-in-out infinite;
}

@keyframes avatarPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.8;
  }
}

@keyframes avatarBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes avatarSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes avatarShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

@keyframes popup {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
