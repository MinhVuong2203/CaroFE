<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useLoadingStore } from '@/stores/loadingStore'
import { connection } from '@/services/signalr'
import { useRoomStore } from '@/stores/roomStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { getSignalRError } from '@/utils/signalr'

const router = useRouter()

const playerName = ref('')
const roomCode = ref('')

const mode = ref(null)

const loading = useLoadingStore()
const notification = useNotificationStore()

//  Variables for the modal
const showCreateModal = ref(false)
const boardSizes = [12, 15, 17, 20]
const selectedSize = ref(15)

const roomStore = useRoomStore()

const createRoom = () => {
  if (!playerName.value.trim()) {
    notification.warning('Vui lòng nhập tên người chơi.', 3000)
    return
  }
  mode.value = 'create'
  showCreateModal.value = true
}

const confirmCreateRoom = async (boardSize) => {
  loading.show(
    'Tìm tập trống...',
    true,
    () => {
      router.back()
    },
    'Không chơi nữa',
  )

  try {
    showCreateModal.value = false
    const response = await connection.invoke('CreateRoom', {
      // invoke: gọi đúng lại tên hàm và tham số dưới Hub
      // vì hàm CreateRoom trong SignalR server-side nhận một CreateRoomRequest chứa playerName và boardSize
      playerName: playerName.value,
      boardSize: boardSize,
    })

    console.log(response)
    roomCode.value = response.roomCode // set roomCode từ response trả về từ server

    roomStore.setRoom({
      ...response,
    }) // set dữ liệu phòng vào store roomStore

    // Lưu dữ liệu vào local để phục vụ khi F5
    localStorage.setItem(
      'caro-session',
      JSON.stringify({
        // Vì sao phải dùng JSON.stringify? Vì localStorage chỉ lưu trữ dữ liệu dưới dạng chuỗi. JSON.stringify chuyển đổi đối tượng JavaScript thành chuỗi JSON để lưu trữ. Khi cần truy xuất lại, bạn có thể sử dụng JSON.parse để chuyển đổi chuỗi JSON trở lại thành đối tượng JavaScript.
        roomCode: roomCode.value.toUpperCase(),
        playerName: playerName.value,
      }),
    )
    console.log({
      roomCode: roomCode.value.toUpperCase(),
      playerName: playerName.value,
    })

    router.push('/game')
  } catch (error) {
    console.error('Error creating room:', error)
    notification.error('Không thể tạo phòng. Vui lòng thử lại.', 3000)
  } finally {
    loading.hide()
  }
}

const joinRoom = async () => {
  // check mã phòng trống
  if (!roomCode.value.trim()) {
    notification.warning('Vui lòng nhập mã phòng.', 3000)
    return
  }

  // loading
  loading.show(
    'Kiểm tra phòng...',
    true,
    () => {
      router.back()
    },
    'Không chơi nữa',
  )

  try {
    // Join gọi hàm JoinRoom trong SignalR server-side
    const response = await connection.invoke('JoinRoom', {
      roomCode: roomCode.value.toUpperCase(),
      playerName: playerName.value,
    })

    roomStore.setRoom({
      ...response,
    }) // set dữ liệu phòng vào store roomStore

    roomCode.value = response.roomCode

    // Biến của Web Storage API do trình duyệt cung cấp, cho phép lưu trữ dữ liệu cục bộ trên máy người dùng.
    // Dữ liệu này sẽ tồn tại ngay cả khi người dùng đóng trình duyệt hoặc tắt máy tính. Ở đây, localStorage được sử dụng để lưu trữ thông tin về phòng và tên người chơi,
    // giúp người dùng có thể tiếp tục trò chơi sau khi tải lại trang hoặc mở lại trình duyệt.
    localStorage.setItem(
      'caro-session',
      JSON.stringify({
        roomCode: roomCode.value.toUpperCase(),
        playerName: playerName.value,
      }),
    )

    router.push('/game')
  } catch (error) {
    console.error('Error joining room:', error)
    notification.error(getSignalRError(error), 3000)
  } finally {
    loading.hide()
  }
}

const showJoinForm = () => {
  if (!playerName.value.trim()) {
    notification.warning('Vui lòng nhập tên người chơi.', 3000)
    return
  }
  mode.value = 'join'
}

const backHome = () => {
  mode.value = null
}
</script>

<template>
  <div class="home fade">
    <div class="home-card">
      <div class="theme-btn">
        <ThemeToggle />
      </div>

      <div class="logo">♟</div>

      <h1 class="title">Caro Online</h1>

      <p class="subtitle">Chơi Caro trực tuyến cùng bạn bè bằng mã phòng</p>

      <!-- Chưa chọn và chọn tạo mới -->
      <div v-if="mode === null || mode === 'create'" class="button-group column">
        <div class="input-group">
          <label>Tên người chơi</label>

          <input v-model="playerName" maxlength="50" placeholder="Nhập tên hiển thị" />
        </div>
        <button class="primary-btn" @click="createRoom">🎮 Tạo phòng</button>

        <button class="secondary-btn" @click="showJoinForm">🚪 Tham gia phòng</button>
      </div>

      <!-- Chọn join -->
      <div v-else>
        <div class="input-group">
          <label>Mã phòng</label>
          <input v-model="roomCode" maxlength="6" placeholder="Ví dụ: A7K9P2" />
        </div>

        <div class="button-group">
          <button class="secondary-btn" @click="backHome">← Quay lại</button>
          <button class="primary-btn" @click="joinRoom">🚪 Tham gia</button>
        </div>
      </div>

      <div class="footer">
        <p>ASP.NET Core • SignalR • Vue 3</p>
      </div>
    </div>
  </div>

  <!-- Modal chọn kích thước bàn cờ -->
  <div v-if="showCreateModal" class="modal-overlay">
    <div class="modal fade">
      <h2 class="title">Kích thước chiến trận</h2>

      <p class="description">Chọn kích thước bàn cờ.</p>

      <div class="board-list">
        <label v-for="size in boardSizes" :key="size" class="board-item">
          <input v-model="selectedSize" type="radio" :value="size" />

          <span>{{ size }} × {{ size }}</span>
        </label>
      </div>

      <div class="actions">
        <button class="secondary-btn" @click="showCreateModal = false">Huỷ</button>

        <button class="primary-btn" @click="confirmCreateRoom(selectedSize)">🎮 Tạo phòng</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/home.css';
</style>
