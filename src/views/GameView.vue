<script setup>
import GameHeader from '@/components/game/GameHeader.vue'
import PlayerCard from '@/components/game/PlayerCard.vue'
import RoomInfo from '@/components/game/RoomInfo.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import ChatBox from '@/components/game/ChatBox.vue'
import EmojiBar from '@/components/game/EmojiBar.vue'
import { useRoomStore } from '@/stores/roomStore'

const roomStore = useRoomStore()
</script>

<template>
  <div class="game-page">
    <GameHeader />

    <div class="game-container">
      <aside class="left-panel">
        <PlayerCard
          :type="roomStore.room.player1?.symbol"
          :name="roomStore.room.player1?.name"
          status="online"
          :isHost="roomStore.room.hostConnectionId === roomStore.room.player1?.connectionId"
          :isTurn="
            roomStore.room.isPlaying &&
            roomStore.room.currentTurn === roomStore.room.player1?.symbol
          "
        />

        <RoomInfo />

        <PlayerCard
          :type="roomStore.room.player2?.symbol"
          :name="roomStore.room.player2?.name"
          status="waiting"
          :isHost="roomStore.room.hostConnectionId === roomStore.room.player2?.connectionId"
          :isTurn="
            roomStore.room.isPlaying &&
            roomStore.room.currentTurn === roomStore.room.player2?.symbol
          "
        />
      </aside>

      <main class="center-panel">
        <GameBoard />
      </main>

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
