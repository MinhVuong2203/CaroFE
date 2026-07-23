<script setup>
import { playButtonSound } from '@/services/audio'

const emit = defineEmits(['click'])

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const handleClick = (event) => {
  if (props.disabled) return

  playButtonSound()
  emit('click', event)
}
</script>

<template>
  <button :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>
