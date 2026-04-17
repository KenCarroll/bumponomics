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
  <div v-if="offlineReady || needRefresh" class="pwa-toast-overlay">
    <div class="pwa-toast" role="alert">
      <div class="message">
        <span v-if="offlineReady">Ready to work offline.</span>
        <span v-else>🚀 New Updates Found! Reload to synchronize.</span>
      </div>
      <div class="buttons">
        <button v-if="needRefresh" @click="updateServiceWorker?.(true)" class="update-btn">Sync Now</button>
        <button @click="close" class="close-btn">Dismiss</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pwa-toast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
  pointer-events: none; /* Let clicks pass through to app underneath when clicking outside the toast */
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 5vh;
}

.pwa-toast {
  pointer-events: auto; /* Block clicks inside the toast */
  width: calc(100% - 32px);
  max-width: 420px;
  background-color: var(--vp-c-brand);
  background-image: linear-gradient(135deg, var(--vp-c-brand) 0%, var(--vp-c-brand-dark) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px;
  color: white;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  0% { transform: translateY(100px) scale(0.95); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

.message {
  font-size: 17px;
  font-weight: 600;
  color: white;
  line-height: 1.4;
}

.buttons {
  display: flex;
  width: 100%;
  gap: 12px;
  justify-content: center;
}

button {
  padding: 12px 24px;
  flex: 1;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, background-color 0.2s, filter 0.2s;
}

button:active {
  transform: scale(0.96);
}

.update-btn {
  background-color: white;
  color: var(--vp-c-brand-dark);
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  text-transform: uppercase;
}
.update-btn:hover {
  background-color: #f8f8f8;
  filter: brightness(1.1);
}

.close-btn {
  background-color: rgba(0,0,0,0.25);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}
.close-btn:hover {
  background-color: rgba(0,0,0,0.4);
}
</style>
