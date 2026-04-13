<template>
  <div class="bumps-img-container" :style="{ width: width }">
    <img :src="src" :alt="alt" class="bumps-img" :style="{ aspectRatio: aspect }" />
    <span v-if="caption" class="caption">{{ caption }}</span>
  </div>
</template>

<script setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  aspect: { type: String, default: 'auto' }, 
  width: { type: String, default: '100%' },
  caption: { type: String, default: null }
})
</script>

<style scoped>
.bumps-img-container {
  margin: 32px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bumps-img {
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--vp-c-divider);
}
.caption {
  margin-top: 12px;
  font-size: 13.5px;
  color: var(--vp-c-text-2);
  font-style: italic;
  text-align: center;
}
</style>
