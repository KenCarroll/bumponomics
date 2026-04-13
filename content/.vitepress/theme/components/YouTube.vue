<template>
  <div class="youtube-wrapper" :style="{ paddingBottom: computedPadding }">
    <iframe
      :src="embedUrl"
      class="youtube-iframe"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  aspect: { type: String, default: '16/9' }
})

// Algorithmically parse the URL to extract YouTube ID. If raw ID is passed, it fails the Regex gracefully and just uses the ID.
const embedUrl = computed(() => {
  const match = props.src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/)
  const videoId = match ? match[1] : props.src
  return `https://www.youtube.com/embed/${videoId}`
})

// Mathematically compute intrinsic ratio trick so the iframe never collapses or breaks screen bounds on mobile
const computedPadding = computed(() => {
  const [w, h] = props.aspect.split('/').map(Number)
  return `${(h / w) * 100}%`
})
</script>

<style scoped>
.youtube-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  margin: 32px 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
