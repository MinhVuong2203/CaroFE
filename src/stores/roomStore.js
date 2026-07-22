import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useRoomStore = defineStore('room', () => {
  const room = ref({
    roomCode: '',
    boardSize: 0,
    board: [],
    currentTurn: '',
    isPlaying: false,
    player1: null,
    player2: null,
    hostConnectionId: null,
    winningCells: [],
  })

  // Toán tử spread (...) được sử dụng để sao chép tất cả các thuộc tính của đối tượng room.value và sau đó ghi đè chúng bằng các thuộc tính mới từ đối tượng data. Điều này giúp cập nhật trạng thái của room mà không làm mất đi các thuộc tính khác.
  // Đây là cú pháp rút gọn của JS thôi, chúng ta hoàn toàn có thể gán trực tiếp thủ công (nhưng nếu sau này có thêm nhiều thuộc tính khác thì sẽ rất rườm rà và dễ bị lỗi)
  const setRoom = (data) => {
    room.value = {
      ...room.value,
      ...data,
    }
  }

  const clearRoom = () => {
    room.value = {
      roomCode: '',
      boardSize: 0,
      board: [],
      currentTurn: '',
      isPlaying: false,
      player1: null,
      player2: null,
      hostConnectionId: null,
      winningCells: [],
    }
  }

  const getQuantityPlayer = computed(() => {
    let quantity = 0
    if (room.value.player1) quantity++
    if (room.value.player2) quantity++
    return quantity
  })
  return { room, setRoom, clearRoom, getQuantityPlayer }
})

// ở đâu gọi const roomStore = useRoomStore() không phải là tạo mới 1 instance của store, mà là lấy ra instance đã được tạo sẵn.
// Vì vậy, nếu bạn gọi useRoomStore() ở nhiều nơi khác nhau trong ứng dụng
// Tất cả chúng sẽ tham chiếu đến cùng một instance của store roomStore.
// Điều này giúp duy trì trạng thái đồng nhất trong toàn bộ ứng dụng.
