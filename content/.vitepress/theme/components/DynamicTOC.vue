<script setup>
import { useData } from 'vitepress'
import { ref } from 'vue'

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

// Reactive array tracking the expanded state of each directory (default opened)
const openNodes = ref(displayItems.map(() => true))
const toggleNode = (index) => {
  openNodes.value[index] = !openNodes.value[index]
}
</script>

<template>
  <ul :class="{ 'vp-doc root-list': isRoot, 'sub-list': !isRoot }">
    <li v-for="(item, index) in displayItems" :key="index">
      
      <div :class="['toc-header', { 'has-children': item.items && item.items.length }]">
        <!-- Expand/Collapse Chevron -->
        <span 
          v-if="item.items && item.items.length" 
          class="toc-toggle" 
          @click.stop.prevent="toggleNode(index)"
          title="Toggle Section"
        >
          {{ openNodes[index] ? '▼' : '▶' }}
        </span>
        <span v-else class="toc-spacer"></span>

        <!-- Render Clickable Link -->
        <a v-if="item.link" :href="item.link + '.html'" :class="item.items && item.items.length ? 'toc-heading toc-parent-link' : 'toc-link'">{{ item.text }}</a>
        
        <!-- Render Non-Clickable Folder Header -->
        <span v-else class="toc-heading">{{ item.text }}</span>
      </div>
      
      <!-- Recursively render children (conditional visibility) -->
      <div v-show="openNodes[index]">
        <DynamicTOC v-if="item.items && item.items.length" :items="item.items" :isRoot="false" />
      </div>

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
  list-style: none !important;
  padding-left: 1.5rem !important;
  margin-top: 0.25rem !important;
  margin-bottom: 0.25rem !important;
}
li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

/* Header layout */
.toc-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.toc-header.has-children {
  margin-top: 1rem;
}

/* The interactive chevron */
.toc-toggle {
  cursor: pointer;
  font-size: 0.8em;
  color: var(--vp-c-text-3);
  user-select: none;
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  transition: all 0.2s;
}
.toc-toggle:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-brand);
}
.toc-spacer {
  width: 1.2rem;
  display: inline-block;
}

/* Typography styles */
.toc-heading {
  font-weight: 700;
  font-size: 1.15em;
  color: var(--vp-c-text-1);
}
.sub-list .toc-heading {
  font-size: 1.05em;
  margin-top: 0;
  font-weight: 600;
}
.toc-link {
  text-decoration: none;
  font-size: 1.05em;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}
.toc-link:hover, .toc-parent-link:hover {
  text-decoration: none;
  color: var(--vp-c-brand);
}
.toc-parent-link {
  text-decoration: none;
  transition: color 0.2s;
}
</style>
