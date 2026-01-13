<template>
  <v-navigation-drawer v-model="isOpen" location="right" :width="drawerWidth" class="right-sidebar"
    style="padding-bottom: 52px;">
    <!-- Resize Handle -->
    <div class="resize-handle" @mousedown="startResize"></div>

    <div class="d-flex flex-column h-100">
      <!-- Tabs Header -->
      <div class="bg-surface border-b">
        <v-tabs v-model="internalTab" density="compact" grow color="primary">
          <v-tab value="chat">
            <v-icon start size="small">mdi-robot</v-icon>
            AI Chat
          </v-tab>
          <v-tab value="reviews">
            <v-icon start size="small">mdi-star-outline</v-icon>
            Reviews
          </v-tab>
          <v-tab value="comments">
            <v-icon start size="small">mdi-comment-text-outline</v-icon>
            Comments
          </v-tab>

        </v-tabs>
      </div>

      <!-- Tab Content -->
      <v-window v-model="internalTab" class="flex-grow-1">

        <!-- Chat Tab -->
        <v-window-item value="chat" class="h-100">
          <chat-panel @close="isOpen = false" />
        </v-window-item>

        <!-- Reviews Tab -->
        <v-window-item value="reviews" class="h-100">
          <site-review-list />
        </v-window-item>

        <!-- Comments Tab -->
        <v-window-item value="comments" class="h-100">
          <!-- Wrapper to ensure full height and scrolling -->
          <div class="d-flex flex-column h-100">
            <!-- Reuse existing CommentSidebar -->
            <comment-sidebar />
          </div>
        </v-window-item>



      </v-window>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import ChatPanel from './ChatPanel.vue'
import CommentSidebar from './CommentSidebar.vue'
import SiteReviewList from './SiteReviewList.vue'


const props = defineProps({
  modelValue: Boolean,
  activeTab: {
    type: String,
    default: 'chat'
  }
})

const emit = defineEmits(['update:modelValue', 'update:activeTab'])

const isOpen = ref(props.modelValue)
const internalTab = ref(props.activeTab)
const drawerWidth = ref(400)

// Sync props <-> internal state
watch(() => props.modelValue, (val) => isOpen.value = val)
watch(() => props.activeTab, (val) => internalTab.value = val)

watch(isOpen, (val) => emit('update:modelValue', val))
watch(internalTab, (val) => emit('update:activeTab', val))

// --- Resize Logic ---
const startResize = (e) => {
  e.preventDefault() // Prevent text selection
  window.addEventListener('mousemove', resizing)
  window.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
}

const resizing = (e) => {
  // Calculate new width: Window Width - Mouse X
  // Ensure we don't go too small or too big
  const newWidth = window.innerWidth - e.clientX
  if (newWidth > 300 && newWidth < 800) {
    drawerWidth.value = newWidth
  }
}

const stopResize = () => {
  window.removeEventListener('mousemove', resizing)
  window.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

onUnmounted(stopResize)
</script>

<style scoped>
.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 5px;
  cursor: ew-resize;
  background: transparent;
  z-index: 100;
}

.resize-handle:hover {
  background: rgba(var(--v-theme-primary), 0.5);
}

/* Ensure v-window takes full height */
:deep(.v-window__container) {
  height: 100%;
}
</style>
