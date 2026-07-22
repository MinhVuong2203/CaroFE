<script setup>
import { onMounted, ref } from "vue";

const isDark = ref(false);

function applyTheme() {
    document.documentElement.classList.toggle("dark", isDark.value);
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
}

function toggleTheme() {
    isDark.value = !isDark.value;
    applyTheme();
}

onMounted(() => {
    isDark.value = localStorage.getItem("theme") === "dark";
    applyTheme();
});
</script>

<template>
    <button class="theme-toggle" @click="toggleTheme">
        {{ isDark ? "☀️" : "🌙" }}
    </button>
</template>

<style scoped>
.theme-toggle{

    width:42px;

    height:42px;

    border:none;

    border-radius:50%;

    cursor:pointer;

    font-size:20px;

    background:var(--surface-hover);

    color:var(--text);

    transition:.25s;

}

.theme-toggle:hover{

    transform:rotate(20deg) scale(1.08);

}
</style>