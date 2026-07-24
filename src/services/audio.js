import backgroundFile from '@/assets/sounds/background.mp3'
import aaaFile from '@/assets/sounds/aaa.wav'
import hooFile from '@/assets/sounds/hoo.wav'
import humFile from '@/assets/sounds/hum.wav'
import oooFile from '@/assets/sounds/ooo.wav'
import winFile from '@/assets/sounds/win.wav'
import buttonFile from '@/assets/sounds/button.wav'

const STORAGE_KEY = 'caro-audio-setting'

let unlocked = false

export async function unlockAudio() {
  if (unlocked) return

  try {
    await backgroundAudio.play()
    backgroundAudio.pause()
    backgroundAudio.currentTime = 0

    unlocked = true

    playBGM() // Phát luôn nhạc nền sau khi mở khóa
  } catch (err) {
    console.warn(err)
  }
}

const defaultSetting = {
  bgmVolume: 5,
  placeVolume: 100,
  winVolume: 100,
  buttonVolume: 100,
}

const setting = loadSetting()

function loadSetting() {
  const json = localStorage.getItem(STORAGE_KEY)

  if (!json) {
    return { ...defaultSetting }
  }

  return {
    ...defaultSetting,
    ...JSON.parse(json),
  }
}

function saveSetting() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(setting))
}

// ===== Khởi tạo Audio (chỉ tạo 1 lần) =====

const backgroundAudio = new Audio(backgroundFile)

const placeSounds = [new Audio(aaaFile), new Audio(hooFile), new Audio(humFile), new Audio(oooFile)]

const winAudio = new Audio(winFile)

const buttonAudio = new Audio(buttonFile)

// ===== Áp dụng Volume =====

backgroundAudio.loop = true

applyVolumes()

function applyVolumes() {
  backgroundAudio.volume = setting.bgmVolume / 100

  placeSounds.forEach((audio) => {
    audio.volume = setting.placeVolume / 100
  })

  winAudio.volume = setting.winVolume / 100

  buttonAudio.volume = setting.buttonVolume / 100
}

// ===== Getter =====

export function getAudioSetting() {
  return { ...setting }
}

// ===== Setter =====

export function setBGMVolume(volume) {
  setting.bgmVolume = Number(volume)
  backgroundAudio.volume = setting.bgmVolume / 100
  saveSetting()
}

export function setPlaceVolume(volume) {
  setting.placeVolume = Number(volume)

  placeSounds.forEach((audio) => {
    audio.volume = setting.placeVolume / 100
  })

  saveSetting()
}

export function setWinVolume(volume) {
  setting.winVolume = Number(volume)
  winAudio.volume = setting.winVolume / 100
  saveSetting()
}

export function setButtonVolume(volume) {
  setting.buttonVolume = Number(volume)
  buttonAudio.volume = setting.buttonVolume / 100
  saveSetting()
}

// ===== Hàm dùng chung =====

function play(audio) {
  audio.currentTime = 0
  audio.play().catch((err) => {
    console.warn('Cannot play audio:', err)
  })
}

// ===== Background =====

export function playBGM() {
  play(backgroundAudio)
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
  play(placeSounds[randomIndex])
}

// ===== Win Sound =====

export function playWinSound() {
  play(winAudio)
}

// ===== Button Sound =====

export function playButtonSound() {
  play(buttonAudio)
}
