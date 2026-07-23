<script setup>
import { onMounted, ref } from 'vue'
import AppButton from './AppButton.vue'

const isDark = ref(false)

function applyTheme() {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()
}

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  applyTheme()
})
</script>

<template>
  <AppButton class="theme-toggle" @click="toggleTheme">
    <i v-if="isDark" class="fa-solid fa-moon fa-swing" style="color: rgb(255, 255, 255)"></i>

    <i v-else class="fa-solid fa-sun fa-spin-snap-8" style="color: rgb(255, 212, 59)"></i>
  </AppButton>
</template>

<style scoped>
.theme-toggle {
  width: 42px;

  height: 42px;

  border: none;

  border-radius: 50%;

  cursor: pointer;

  font-size: 20px;

  background: var(--surface-hover);

  color: var(--text);

  transition: 0.25s;
}

.theme-toggle:hover {
  transform: rotate(20deg) scale(1.08);
}
</style>
