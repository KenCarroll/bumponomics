<template>
  <div class="bumps-video-container" :style="{ width: width }">
    <video controls class="bumps-video" :style="{ aspectRatio: aspect }" preload="metadata">
      <source :src="src" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <span v-if="caption" class="caption">{{ caption }}</span>
  </div>
</template>

<script setup>
defineProps({
  src: { type: String, required: true },
  aspect: { type: String, default: '16/9' },
  width: { type: String, default: '100%' },
  caption: { type: String, default: null }
})
</script>

<style scoped>
.bumps-video-container {
  margin: 32px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bumps-video {
  width: 100%;
  background: #000;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--vp-c-divider);
  outline: none;
}
.caption {
  margin-top: 12px;
  font-size: 13.5px;
  color: var(--vp-c-text-2);
  font-style: italic;
  text-align: center;
}
</style>
