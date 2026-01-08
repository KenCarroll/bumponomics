<template>
  <v-container class="reader-container" max-width="900">
    <div v-if="loading" class="d-flex justify-center my-10">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="error" class="text-center my-10 text-error">
      <v-icon size="64" color="error">mdi-alert-circle-outline</v-icon>
      <h2 class="mt-4">Content Not Found</h2>
      <p>Could not load the requested chapter.</p>
    </div>

    <div v-else class="markdown-body pt-4 pb-10">
      <!-- Rendered Content -->
      <div v-html="renderedContent"></div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import contentTree from '@/content.json'

const route = useRoute()
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const loading = ref(false)
const error = ref(false)
const markdownSource = ref('')

// Flatten tree to find content easily by path
const flatten = (nodes) => {
  let flat = []
  nodes.forEach(node => {
    if (node.type === 'file') flat.push(node)
    if (node.children) flat = flat.concat(flatten(node.children))
  })
  return flat
}
const allFiles = flatten(contentTree)

const loadContent = () => {
  loading.value = true
  error.value = false
  
  // Clean the path param (decode URI component)
  const targetPath = route.params.path ? decodeURIComponent(route.params.path) : null
  
  if (!targetPath) {
    // If no path, maybe show the first file?
    loading.value = false
    return
  }

  const fileNode = allFiles.find(f => f.path === targetPath)

  if (fileNode && fileNode.content) {
    markdownSource.value = fileNode.content
  } else {
    error.value = true
  }
  loading.value = false
}

const renderedContent = computed(() => {
  return md.render(markdownSource.value)
})

watch(() => route.params.path, loadContent)
onMounted(loadContent)
</script>

<style>
/* Minimal Typography for Reading */
.markdown-body {
  font-family: 'Georgia', serif; /* Classic book feel */
  line-height: 1.8;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.87);
}

.markdown-body h1 {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
  color: #ffca28; /* Amber accent */
}

.markdown-body h2 {
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 0.5rem;
}

.markdown-body p {
  margin-bottom: 1.5rem;
}

.markdown-body ul {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.markdown-body blockquote {
  border-left: 4px solid #ffca28;
  padding-left: 1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin: 1.5rem 0;
}
</style>
