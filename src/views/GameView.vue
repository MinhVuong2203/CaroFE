<script setup>
import GameHeader from '@/components/game/GameHeader.vue'
import PlayerCard from '@/components/game/PlayerCard.vue'
import RoomInfo from '@/components/game/RoomInfo.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import ChatBox from '@/components/game/ChatBox.vue'
import EmojiBar from '@/components/game/EmojiBar.vue'
import { useRoomStore } from '@/stores/roomStore'
import { onMounted, onUnmounted, ref } from 'vue'
import { playBGM, stopBGM } from '@/services/audio'
import ViewerList from '@/components/game/ViewerList.vue'
import { connection } from '@/services/signalr'
import { useNotificationStore } from '@/stores/notificationStore'
import { getSignalRError } from '@/utils/signalr'

const roomStore = useRoomStore()
const selectedConnectionId = ref(null)
const notification = useNotificationStore()
onMounted(() => {
  playBGM()
})

onUnmounted(() => {
  stopBGM()
})

const selectPlayer = async (connectionId) => {
  // Chỉ host mới được swap
  if (roomStore.room.hostConnectionId !== connection.connectionId) return

  // Click lần đầu
  if (!selectedConnectionId.value) {
    selectedConnectionId.value = connectionId
    return
  }

  // Click lại chính mình => bỏ chọn
  if (selectedConnectionId.value === connectionId) {
    selectedConnectionId.value = null
    return
  }

  try {
    await connection.invoke('SwapPlayer', {
      roomCode: roomStore.room.roomCode,
      sourceConnectionId: selectedConnectionId.value,
      targetConnectionId: connectionId,
    })

    selectedConnectionId.value = null
  } catch (err) {
    notification.error(getSignalRError(err))
  } finally {
    selectedConnectionId.value = null
  }
}
</script>

<template>
  <div class="game-page">
    <GameHeader />

    <div class="game-container">
      <div class="area-p1">
        <PlayerCard
          type="X"
          :name="roomStore.room.player1?.name"
          :isHost="roomStore.room.hostConnectionId === roomStore.room.player1?.connectionId"
          :isTurn="roomStore.room.isPlaying && roomStore.room.currentTurn === 'X'"
          @click="selectPlayer(roomStore.room.player1?.connectionId)"
          :selected="selectedConnectionId === roomStore.room.player1?.connectionId"
        />
      </div>

      <div class="area-info">
        <RoomInfo />
      </div>

      <div class="area-p2">
        <PlayerCard
          type="O"
          :name="roomStore.room.player2?.name"
          :isHost="roomStore.room.hostConnectionId === roomStore.room.player2?.connectionId"
          :isTurn="roomStore.room.isPlaying && roomStore.room.currentTurn === 'O'"
          @click="selectPlayer(roomStore.room.player2?.connectionId)"
          :selected="selectedConnectionId === roomStore.room.player2?.connectionId"
        />
      </div>

      <div class="area-board">
        <GameBoard />
        <ViewerList :selectedConnectionId="selectedConnectionId" @select="selectPlayer" />
      </div>

      <!-- <aside class="right-panel">
        <ChatBox />

        <EmojiBar />
      </aside> -->
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/game.css';
</style>
