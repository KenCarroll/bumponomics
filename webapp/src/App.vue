<template>
  <v-app>
    <v-app-bar flat border="b">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>
        <strong style="font-weight: 900; letter-spacing: 0.5px; font-style: italic;">BUMPONOMICS</strong>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Search Toggle -->
      <v-btn icon class="mr-2" @click="searchOpen = true">
        <v-icon>mdi-magnify</v-icon>
        <v-tooltip activator="parent" location="bottom">Search Book</v-tooltip>
      </v-btn>

      <!-- AI Chat Toggle -->
      <v-btn v-if="user" icon :color="rightDrawerOpen && rightTab === 'chat' ? 'primary' : undefined" class="mr-2"
        @click="toggleRightDrawer('chat')">
        <v-icon>mdi-robot</v-icon>
        <v-tooltip activator="parent" location="bottom">Ask AI</v-tooltip>
      </v-btn>

      <!-- Reviews Toggle -->
      <v-btn icon class="mr-2" :color="rightDrawerOpen && rightTab === 'reviews' ? 'primary' : undefined"
        @click="toggleRightDrawer('reviews')">
        <v-icon>mdi-star-box-outline</v-icon>
        <v-tooltip activator="parent" location="bottom">Read Reviews</v-tooltip>
      </v-btn>

      <!-- Support Toggle -->
      <v-btn v-if="user" icon class="mr-2" to="/support">
        <v-icon color="pink">mdi-heart</v-icon>
        <v-tooltip activator="parent" location="bottom">Support Mission</v-tooltip>
      </v-btn>

      <!-- Comments Toggle -->
      <v-btn icon class="mr-2" :color="rightDrawerOpen && rightTab === 'comments' ? 'primary' : undefined"
        @click="toggleRightDrawer('comments')">
        <v-icon>mdi-comment-text-outline</v-icon>
        <v-tooltip activator="parent" location="bottom">Comments</v-tooltip>
      </v-btn>



      <login-button class="mr-4" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :temporary="!isDocked" :permanent="isDocked" width="300"
      style="padding-bottom: 52px;">
      <div class="pa-4 text-center">
        <h2 class="text-h5 font-weight-bold text-primary">BUMPONOMICS</h2>
        <div class="text-caption mt-1">Problem Transforming Economics</div>
      </div>
      <v-divider class="mb-2"></v-divider>

      <app-drawer :items="contentItems" is-root />

      <template v-slot:append>
        <v-divider></v-divider>
        <div class="px-4 pb-4 pt-4">
          <v-switch :model-value="isDark" @update:model-value="toggleTheme" color="primary"
            :label="isDark ? 'Dark Mode' : 'Light Mode'" hide-details density="compact" class="mb-2" inset></v-switch>

          <v-switch v-model="isDocked" color="success" label="Dock Menu" hide-details density="compact" class="mb-2"
            inset></v-switch>

          <v-divider class="mb-3"></v-divider>

          <div class="text-caption text-medium-emphasis">
            &copy; 2026 Bumponomics&trade;<br>
            All Rights Reserved.
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Right Sidebar (Unified Chat & Comments) -->
    <right-sidebar v-model="rightDrawerOpen" v-model:active-tab="rightTab" />

    <!-- Main Content Area with Background fix -->
    <v-main class="bg-background">
      <router-view />
    </v-main>

    <!-- Bottom App Bar -->
    <v-footer v-if="route.name === 'read'" app border="t" height="50" class="d-flex align-center"
      style="z-index: 2000;">
      <div class="d-flex align-center" :style="mobile ? '' : 'max-width: 40%;'">
        <v-btn icon variant="text" density="compact" v-if="mobile">
          <v-icon size="small">mdi-book-open-page-variant</v-icon>
          <v-tooltip activator="parent" location="top">{{ currentPageTitle }}</v-tooltip>
        </v-btn>

        <template v-else>
          <v-icon size="small" class="mr-2">mdi-book-open-page-variant</v-icon>
          <span class="text-body-2 text-medium-emphasis text-truncate">{{ currentPageTitle }}</span>
        </template>
      </div>

      <v-spacer></v-spacer>

      <!-- Navigation Controls (Center) -->
      <div class="d-flex align-center">
        <v-btn icon density="compact" variant="text" :disabled="!prevPage" @click="navigateTo(prevPage?.path)">
          <v-icon>mdi-chevron-left</v-icon>
          <v-tooltip activator="parent" location="top" v-if="prevPage">Previous: {{ prevPage.title || prevPage.name
            }}</v-tooltip>
        </v-btn>

        <span class="text-caption text-medium-emphasis mx-2" style="min-width: 60px; text-align: center;">
          {{ currentIndex !== -1 ? `${currentIndex + 1} / ${totalFilesCount}` : '' }}
        </span>

        <v-btn icon density="compact" variant="text" :disabled="!nextPage" @click="navigateTo(nextPage?.path)">
          <v-icon>mdi-chevron-right</v-icon>
          <v-tooltip activator="parent" location="top" v-if="nextPage">Next: {{ nextPage.title || nextPage.name
            }}</v-tooltip>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <!-- Page Completion Toggle (Fixed Position on Right) -->
      <div v-if="user && route.params.path" class="d-flex align-center mr-2">
        <v-btn :color="isPageCompleted(decodeURIComponent(route.params.path)) ? 'success' : 'primary'"
          :variant="isPageCompleted(decodeURIComponent(route.params.path)) ? 'flat' : 'tonal'" density="compact"
          :class="mobile ? '' : 'px-4 text-capitalize'" :icon="mobile"
          @click="togglePageCompletion(decodeURIComponent(route.params.path))">

          <v-icon :start="!mobile">{{ isPageCompleted(decodeURIComponent(route.params.path)) ? 'mdi-check-circle' :
            'mdi-checkbox-blank-circle-outline' }}</v-icon>

          <span v-if="!mobile">{{ isPageCompleted(decodeURIComponent(route.params.path)) ? 'Completed' : 'Mark Complete'
            }}</span>

          <v-tooltip v-if="mobile" activator="parent" location="top">
            {{ isPageCompleted(decodeURIComponent(route.params.path)) ? 'Completed' : 'Mark Complete' }}
          </v-tooltip>
        </v-btn>
      </div>
    </v-footer>

    <!-- Global Search Dialog -->
    <search-dialog v-model="searchOpen" />
  </v-app>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppDrawer from '@/components/AppDrawer.vue'
import LoginButton from '@/components/LoginButton.vue'
import RightSidebar from '@/components/RightSidebar.vue'
import SearchDialog from '@/components/SearchDialog.vue'
import contentItems from '@/content.json'
import { useAuth } from '@/composables/useAuth'
import { usePreferences } from '@/composables/usePreferences'
import { useProgress } from '@/composables/useProgress'

const route = useRoute()
const drawer = ref(true)
const isDocked = ref(false)
const searchOpen = ref(false)

// Unified Right Drawer State
const rightDrawerOpen = ref(false)
const rightTab = ref('chat') // 'chat' or 'comments'

const { user } = useAuth()
// ... existing logic ...
const { isDark, toggleTheme } = usePreferences()

// Progress Logic
const { togglePageCompletion, isPageCompleted, setTotalPages } = useProgress()

// Display Logic for Responsive Layout
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

// Toggle Right Drawer and specific tab
const toggleRightDrawer = (tab) => {
  if (rightDrawerOpen.value && rightTab.value === tab) {
    // If open and on same tab, close it
    rightDrawerOpen.value = false
  } else {
    // Otherwise open and switch tab
    rightTab.value = tab
    rightDrawerOpen.value = true
  }
}

// Helper to find title from path
const flatten = (nodes) => {
  let flat = []
  nodes.forEach(node => {
    flat.push(node)
    if (node.children) flat = flat.concat(flatten(node.children))
  })
  return flat
}
const allNodes = flatten(contentItems)
// Initialize total pages count
const totalFilesCount = allNodes.filter(n => n.type === 'file').length
setTotalPages(totalFilesCount)

const currentPageTitle = computed(() => {
  if (!route.params.path) return 'Home'
  const path = decodeURIComponent(route.params.path)
  const node = allNodes.find(n => n.path === path)
  return node ? (node.title || node.name) : 'Reading...'
})

// Navigation Logic
import { useRouter } from 'vue-router'
const router = useRouter()
const allFiles = allNodes.filter(n => n.type === 'file')

const currentIndex = computed(() => {
  if (!route.params.path) return -1
  const path = decodeURIComponent(route.params.path)
  return allFiles.findIndex(f => f.path === path)
})

const prevPage = computed(() => {
  if (currentIndex.value > 0) return allFiles[currentIndex.value - 1]
  return null
})

const nextPage = computed(() => {
  if (currentIndex.value !== -1 && currentIndex.value < allFiles.length - 1) return allFiles[currentIndex.value + 1]
  if (currentIndex.value === -1 && allFiles.length > 0) return allFiles[0] // Start from first page if on home
  return null
})

const navigateTo = (path) => {
  if (path) router.push({ name: 'read', params: { path: encodeURIComponent(path) } })
}

// Close drawer if user logs out (optional, mainly for chat protection)
watch(user, (newUser) => {
  if (!newUser) {
    rightDrawerOpen.value = false
  }
})
</script>
