<script setup>
import { onMounted, ref } from 'vue'

const offlineReady = ref(false)
const needRefresh = ref(false)

let updateServiceWorker

onMounted(async () => {
  const { registerSW } = await import('virtual:pwa-register')
  updateServiceWorker = registerSW({
    immediate: true,
    onOfflineReady() {
      offlineReady.value = true
    },
    onNeedRefresh() {
      needRefresh.value = true
    },
  })
})

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div v-if="offlineReady || needRefresh" class="pwa-toast" role="alert">
    <div class="message">
      <span v-if="offlineReady">App ready to work offline</span>
      <span v-else>New content available, click on reload button to update.</span>
    </div>
    <div class="buttons">
      <button v-if="needRefresh" @click="updateServiceWorker?.(true)" class="update-btn">Reload</button>
      <button @click="close" class="close-btn">Close</button>
    </div>
  </div>
</template>

<style scoped>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 18px 24px;
  z-index: 1000;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.message {
  font-size: 14px;
  color: var(--vp-c-text-1);
}
.buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
button {
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.update-btn {
  background-color: var(--vp-c-brand);
  color: white;
  border: 1px solid var(--vp-c-brand);
}
.update-btn:hover {
  background-color: transparent;
  outline: 1px solid var(--vp-c-brand);
  color: var(--vp-c-brand);
}
.close-btn {
  background-color: transparent;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}
.close-btn:hover {
  border-color: var(--vp-c-text-1);
  color: var(--vp-c-text-1);
}
</style>
