<script setup>
import GameHeader from '@/components/game/GameHeader.vue'
import PlayerCard from '@/components/game/PlayerCard.vue'
import RoomInfo from '@/components/game/RoomInfo.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import ChatBox from '@/components/game/ChatBox.vue'
import EmojiBar from '@/components/game/EmojiBar.vue'
import { useRoomStore } from '@/stores/roomStore'
import { onMounted, onUnmounted } from 'vue'
import { playBGM, stopBGM } from '@/services/audio'

const roomStore = useRoomStore()

onMounted(() => {
  playBGM()
})

onUnmounted(() => {
  stopBGM()
})
</script>

<template>
  <div class="game-page">
    <GameHeader />

    <div class="game-container">
      <div class="area-p1">
        <PlayerCard
          :type="roomStore.room.player1?.symbol"
          :name="roomStore.room.player1?.name"
          :isHost="roomStore.room.hostConnectionId === roomStore.room.player1?.connectionId"
          :isTurn="
            roomStore.room.isPlaying &&
            roomStore.room.currentTurn === roomStore.room.player1?.symbol
          "
        />
      </div>

      <div class="area-info">
        <RoomInfo />
      </div>

      <div class="area-p2">
        <PlayerCard
          :type="roomStore.room.player2?.symbol"
          :name="roomStore.room.player2?.name"
          :isHost="roomStore.room.hostConnectionId === roomStore.room.player2?.connectionId"
          :isTurn="
            roomStore.room.isPlaying &&
            roomStore.room.currentTurn === roomStore.room.player2?.symbol
          "
        />
      </div>

      <div class="area-board">
        <GameBoard />
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
