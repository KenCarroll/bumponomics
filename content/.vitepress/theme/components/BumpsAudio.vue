<template>
  <div class="bumps-audio-container" :style="{ width: width }">
    <audio controls class="bumps-audio" preload="metadata">
      <source :src="src" type="audio/mpeg">
      Your browser does not support the audio tag.
    </audio>
    <span v-if="caption" class="caption">{{ caption }}</span>
  </div>
</template>

<script setup>
defineProps({
  src: { type: String, required: true },
  width: { type: String, default: '100%' },
  caption: { type: String, default: null }
})
</script>

<style scoped>
.bumps-audio-container {
  margin: 32px auto;
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
.bumps-audio {
  width: 100%;
  outline: none;
}
.caption {
  margin-top: 16px;
  font-size: 13.5px;
  color: var(--vp-c-text-2);
  font-style: italic;
  text-align: center;
}
</style>
