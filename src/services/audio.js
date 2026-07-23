import backgroundFile from '@/assets/sounds/background.mp3'
import aaaFile from '@/assets/sounds/aaa.wav'
import hooFile from '@/assets/sounds/hoo.wav'
import humFile from '@/assets/sounds/hum.wav'
import oooFile from '@/assets/sounds/ooo.wav'
import win from '@/assets/sounds/win.wav'
import button from '@/assets/sounds/button.wav'

// ===== Khởi tạo Audio (chỉ tạo 1 lần) =====

const backgroundAudio = new Audio(backgroundFile) // Background

const placeSounds = [new Audio(aaaFile), new Audio(hooFile), new Audio(humFile), new Audio(oooFile)] // Place sound

const winAudio = new Audio(win) //  Win sound

const buttonSound = new Audio(button) // Button sound

// ===== Cấu hình =====
backgroundAudio.loop = true
backgroundAudio.volume = 0.15

placeSounds.forEach((audio) => {
  audio.volume = 0.8
})

winAudio.volume = 0.8

buttonSound.volume = 0.8

// ===== Hàm dùng chung =====
function play(audio) {
  audio.currentTime = 0
  audio.play().catch((err) => {
    console.warn('Cannot play audio:', err)
  })
}

// ===== Background =====
export function playBGM() {
  backgroundAudio.play().catch(() => {})
}

export function pauseBGM() {
  backgroundAudio.pause()
}

export function stopBGM() {
  backgroundAudio.pause()
  backgroundAudio.currentTime = 0
}

// ===== Place Sound =====
export function playPlaceSound() {
  const randomIndex = Math.floor(Math.random() * placeSounds.length)
  const audio = placeSounds[randomIndex]

  audio.currentTime = 0
  audio.play().catch(() => {})
}

// ==== Win Sound =====
export function playWinSound() {
  winAudio.currentTime = 0
  winAudio.play().catch(() => {})
}

// ==== Button Sound =====
export function playButtonSound() {
  buttonSound.currentTime = 0
  buttonSound.play().catch(() => {})
}
