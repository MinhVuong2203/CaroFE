<script setup>
import { RouterView } from 'vue-router'
import LoadingOverlay from './components/common/LoadingOverlay.vue'
import { connection } from './services/signalr.js'
import AppNotification from './components/common/AppNotification.vue'
import { useRoomStore } from './stores/roomStore.js'
import router from './router/index.js'
import Swal from 'sweetalert2'
import { playWinSound, unlockAudio } from './services/audio.js'
import { onMounted } from 'vue'
import { useNotificationStore } from './stores/notificationStore.js'

const roomStore = useRoomStore()
const notification = useNotificationStore()

onMounted(() => {
  window.addEventListener(
    'pointerdown',
    () => {
      unlockAudio()
    },
    {
      once: true,
    },
  )
})

connection
  .start()
  .then(async () => {
    // Đến đây là phục vụ kết nối SignalR thành công
    console.log('Connected')
    // Đây phục vụ cho việc F5, khi F5 thì sẽ mất dữ liệu trong store, nên cần lấy dữ liệu từ localStorage để set lại vào store
    const session = localStorage.getItem('caro-session')
    if (!session) return
    const { roomCode, playerName } = JSON.parse(session)
    console.log('Session data:', { roomCode, playerName })
    try {
      const response = await connection.invoke('Reconnect', { roomCode, playerName })
      console.log('Reconnect response:', response)
      roomStore.setRoom(response) // set dữ liệu phòng vào store roomStore
      router.push('/game')
    } catch (err) {
      console.error('Error parsing session data:', err)
      localStorage.removeItem('caro-session') // Xóa session nếu có lỗi
    }
  })
  .catch((err) => {
    console.error('SignalR connection error:')
  })

// Lắng nghe sự kiện RoomUpdated từ server và cập nhật dữ liệu phòng trong store (realtime), phải mở ở đây,
// RoomUpdated khớp với tên sự kiện được gửi từ server-side SignalR, roomStore.setRoom(room) sẽ cập nhật dữ liệu phòng trong store
connection.on('RoomUpdated', (room) => {
  const wasPlaying = roomStore.room.isPlaying
  roomStore.setRoom(room)

  console.log('Room updated:', room)

  if (wasPlaying && !room.isPlaying && room.winningCells.length > 0) {
    setTimeout(() => {
      const winner = room.currentTurn === 'X' ? room.player1?.name : room.player2?.name
      Swal.fire({
        icon: undefined,
        title: 'Kết thúc ván đấu!',
        html: `
          <div>
            <i class="fa-solid fa-crown fa-bounce fa-4x" style="color:var(--success)"></i>

            <p style="margin-top:20px">
              <b>${winner}</b> đã chiến thắng
            </p>
          </div>
        `,
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title',
          htmlContainer: 'swal-html',
          confirmButton: 'swal-confirm',
        },
      })
      playWinSound()
    }, 1000)
  }
})

// Lắng nghe sự kiện ReceiveDrawRequest từ server và hiển thị thông báo yêu cầu hòa
connection.on('ReceiveDrawRequest', async () => {
  const result = await Swal.fire({
    title: 'Yêu cầu hòa',
    html: `
      <div style="font-size:15px;color:var(--modal-text)">
        <i class="fa-solid fa-handshake fa-shake"
           style="
              font-size:52px;
              color:var(--modal-warning);
              margin-bottom:18px;
           ">
        </i>

        <p style="margin-bottom:10px">
          Đối thủ muốn <b>hòa trận đấu</b>.
        </p>

        <small style="color:var(--text-secondary)">
          Nếu đồng ý, trận đấu sẽ kết thúc và cả hai được tính là hòa.
        </small>
      </div>
    `,

    showCancelButton: true,

    confirmButtonText: '<i class="fa-solid fa-check"></i> Đồng ý',

    cancelButtonText: '<i class="fa-solid fa-xmark"></i> Từ chối',

    buttonsStyling: false,

    customClass: {
      popup: 'swal-popup',
      confirmButton: 'swal-confirm',
      cancelButton: 'swal-cancel',
    },
  })

  if (result.isConfirmed) {
    await connection.invoke('AcceptDraw', roomStore.room.roomCode)
  } else {
    await connection.invoke('RejectDraw', roomStore.room.roomCode)
  }
})

connection.on('DrawRejected', () => {
  notification.warning('Đối thủ đã từ chối yêu cầu hòa.', 3000)
})

connection.on('AcceptDraw', () => {
  notification.warning('Đối thủ đã đồng ý yêu cầu hòa.', 3000)
})
</script>

<template>
  <LoadingOverlay />
  <AppNotification />
  <RouterView />
</template>
