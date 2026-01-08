<template>
  <v-dialog
    v-model="modelValue"
    max-width="600"
    scrollable
  >
    <v-card class="search-card rounded-lg" elevation="24">
      <!-- Search Input Header -->
      <v-card-title class="pa-0">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search book content..."
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          hide-details
          autofocus
          class="search-input"
          bg-color="surface"
          clearable
          @click:clear="searchQuery = ''"
        ></v-text-field>
      </v-card-title>

      <!-- Results List -->
      <v-divider></v-divider>
      <v-card-text class="pa-0 bg-surface" style="max-height: 500px;">
        
        <!-- Empty State / Instructions -->
        <div v-if="!searchQuery" class="pa-5 text-center text-medium-emphasis">
          <v-icon size="48" class="mb-3 opacity-50">mdi-book-open-page-variant-outline</v-icon>
          <p>Type to search chapter titles and text.</p>
        </div>

        <!-- No Results -->
        <div v-else-if="results.length === 0" class="pa-5 text-center text-medium-emphasis">
          <p>No matches found for "{{ searchQuery }}"</p>
        </div>

        <!-- Results -->
        <v-list v-else lines="two" bg-color="surface">
          <v-list-item
            v-for="(result, i) in results"
            :key="i"
            @click="goTo(result.path)"
            :value="result"
            color="primary"
            class="py-3"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-file-document-outline" size="small" class="mr-3 text-medium-emphasis"></v-icon>
            </template>

            <v-list-item-title class="text-subtitle-1 font-weight-bold text-primary mb-1">
              {{ result.title }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-body-2 text-high-emphasis">
              <span v-html="highlight(result.snippet, searchQuery)"></span>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
      
      <!-- Footer Tip -->
      <v-divider></v-divider>
      <div class="pa-2 px-4 text-caption text-medium-emphasis bg-surface d-flex justify-space-between">
        <span>{{ results.length }} results found</span>
        <span>Press <kbd>ESC</kbd> to close</span>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import contentItems from '@/content.json'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const searchQuery = ref('')

// Computed wrapper for v-model
const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Flatten content tree
const flatten = (nodes) => {
  let flat = []
  nodes.forEach(node => {
    if (node.type === 'file') {
      flat.push(node)
    }
    if (node.children) {
      flat = flat.concat(flatten(node.children))
    }
  })
  return flat
}
const allFiles = flatten(contentItems)

// Search Logic
const results = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return []

  const matches = []

  for (const file of allFiles) {
    // 1. Title Match
    const titleMatch = (file.title || file.name).toLowerCase().includes(query)
    
    // 2. Content Match
    const content = file.content || ''
    const lowerContent = content.toLowerCase()
    const contentIndex = lowerContent.indexOf(query)
    const contentMatch = contentIndex !== -1

    if (titleMatch || contentMatch) {
      // Create Snippet
      let snippet = ''
      if (contentMatch) {
        // Grab context around the match
        const start = Math.max(0, contentIndex - 40)
        const end = Math.min(content.length, contentIndex + query.length + 60)
        snippet = (start > 0 ? '...' : '') + 
                  content.slice(start, end).replace(/\n/g, ' ') + 
                  (end < content.length ? '...' : '')
      } else {
        // Or just show start of file
        snippet = content.slice(0, 100).replace(/\n/g, ' ') + '...'
      }

      matches.push({
        ...file,
        snippet,
        score: titleMatch ? 10 : 5 // Prioritize title matches
      })
    }
  }

  // Sort by score
  return matches.sort((a, b) => b.score - a.score).slice(0, 20)
})

// Navigation
const goTo = (path) => {
  router.push(`/read/${encodeURIComponent(path)}`)
  modelValue.value = false
  searchQuery.value = ''
}

// Helper to bold matches in snippet
const highlight = (text, query) => {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<span class="text-primary font-weight-bold">$1</span>')
}

// Reset query on open
watch(modelValue, (val) => {
  if (val) {
    // potentially focus input manually if autofocus attribute is flaky
  }
})
</script>

<style scoped>
.search-card {
  overflow: hidden;
}
/* Remove default input styling to merge with header */
:deep(.v-field__outline) {
  display: none !important;
}
:deep(.v-field__input) {
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 1.2rem;
}
kbd {
  background: rgba(var(--v-theme-on-surface), 0.1);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.75rem;
}
</style>
