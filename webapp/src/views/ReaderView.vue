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
      <!-- File Header with Icon -->
      <div v-if="currentFile" class="d-flex align-center mb-6 text-primary">
        <v-icon size="32" class="mr-4">{{ getIcon(currentFile) }}</v-icon>
        <h1 class="text-h4 font-weight-bold ma-0" style="line-height: 1.2;">
          {{ currentFile.title || currentFile.name }}
        </h1>
      </div>
      <v-divider class="mb-8"></v-divider>

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
import { useIcons } from '@/composables/useIcons'

const route = useRoute()
const { getIcon } = useIcons()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const loading = ref(false)
const error = ref(false)
const markdownSource = ref('')
const currentFile = ref(null)

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
    currentFile.value = fileNode
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


