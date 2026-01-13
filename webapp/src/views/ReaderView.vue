<template>
  <div class="reader-wrapper fill-height">
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

        <!-- Rendered Content (or Login Barrier) -->
        <template v-if="showContent">
          <div v-html="renderedContent"></div>
        </template>

        <div v-else class="text-center py-10 my-10 bg-surface-variant rounded-lg">
          <v-icon size="64" color="primary" class="mb-4">mdi-lock</v-icon>
          <h2 class="text-h4 font-weight-bold mb-2">Members Only Content</h2>
          <p class="text-body-1 mb-6 text-medium-emphasis" style="max-width: 500px; margin: 0 auto;">
            This chapter is part of the full BUMPS Book experience. <br>
            Join our community of problem solvers to continue reading for free.
          </p>

          <v-btn color="primary" size="large" prepend-icon="mdi-google" :loading="authLoading" @click="signInWithGoogle"
            elevation="4">
            Sign in with Google
          </v-btn>
        </div>
      </div>
    </v-container>




  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import contentTree from '@/content.json'
import { useIcons } from '@/composables/useIcons'
import { useAuth } from '@/composables/useAuth'
import YouTubeEmbed from '@/utils/markdownItVideo'
import { useLayout } from '@/composables/useLayout'

const route = useRoute()
const { getIcon } = useIcons()
const { user, signInWithGoogle, loading: authLoading } = useAuth()
const { rightDrawerOpen, toggleRightDrawer } = useLayout()


const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
md.use(YouTubeEmbed)

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

const isRestricted = computed(() => {
  if (!currentFile.value) return false
  const path = currentFile.value.path
  // RESTRICTION RULE:
  // Public: "Part 0" (Preface) and "Part 1" (The Premise)
  // Restricted: Everything else
  const isPart0 = path.startsWith('Part 0')
  const isPart1 = path.startsWith('Part 1')

  return !(isPart0 || isPart1)
})

const showContent = computed(() => {
  if (!isRestricted.value) return true
  return !!user.value
})

const renderedContent = computed(() => {
  return md.render(markdownSource.value)
})

watch(() => route.params.path, loadContent)
onMounted(loadContent)
</script>

<style>
.video-responsive {
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;
  margin-bottom: 1rem;
}

.video-responsive iframe {
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>

<style scoped>
/* Ensure proper list indentation */
:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  padding-left: 2rem;
  margin-bottom: 1rem;
}

:deep(.markdown-body li) {
  margin-bottom: 0.5rem;
}

/* Improve readability on mobile by ensuring container padding */
.reader-container {
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Make headers pop a bit more */
:deep(.markdown-body h2) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.2);
  padding-bottom: 0.5rem;
}

:deep(.markdown-body h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.faq-fab {
  position: fixed;
  bottom: 80px;
  /* Above the 50px footer with padding */
  right: 24px;
  z-index: 2500;
  /* Above footer (2000) but below drawer (3000) */
}
</style>
