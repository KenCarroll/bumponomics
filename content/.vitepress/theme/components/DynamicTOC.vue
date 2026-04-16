<script setup>
import { useData } from 'vitepress'

const props = defineProps({
  items: Array,
  isRoot: {
    type: Boolean,
    default: true
  }
})

const { theme } = useData()
// If it's the root call, pull the sidebar array from the VitePress theme config
const displayItems = props.isRoot ? theme.value.sidebar : props.items
</script>

<template>
  <ul :class="{ 'vp-doc root-list': isRoot, 'sub-list': !isRoot }">
    <li v-for="(item, index) in displayItems" :key="index">
      
      <!-- Render Clickable Link -->
      <a v-if="item.link" :href="item.link + '.html'" class="toc-link">{{ item.text }}</a>
      
      <!-- Render Folder Header -->
      <span v-else class="toc-heading">{{ item.text }}</span>
      
      <!-- Recursively render children -->
      <DynamicTOC v-if="item.items && item.items.length" :items="item.items" :isRoot="false" />
    </li>
  </ul>
</template>

<style scoped>
.root-list {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
.sub-list {
  list-style: circle;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}
.toc-heading {
  font-weight: 800;
  font-size: 1.2em;
  display: block;
  margin-top: 1.5rem;
  color: var(--vp-c-text-1);
}
.sub-list .toc-heading {
  font-size: 1.05em;
  margin-top: 0.75rem;
  font-weight: 600;
}
.toc-link {
  text-decoration: none;
  font-size: 1.05em;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}
.toc-link:hover {
  color: var(--vp-c-brand);
}
</style>
