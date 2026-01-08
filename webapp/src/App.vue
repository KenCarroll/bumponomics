<template>
  <v-app>
    <v-app-bar flat border="b">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-light">Bumponomics</v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Search Toggle -->
      <v-btn icon class="mr-2" @click="searchOpen = true">
        <v-icon>mdi-magnify</v-icon>
        <v-tooltip activator="parent" location="bottom">Search Book</v-tooltip>
      </v-btn>

      <!-- AI Chat Toggle -->
      <v-btn 
        v-if="user" 
        icon 
        :color="rightDrawerOpen && rightTab === 'chat' ? 'primary' : undefined"
        class="mr-2" 
        @click="toggleRightDrawer('chat')"
      >
        <v-icon>mdi-robot</v-icon>
        <v-tooltip activator="parent" location="bottom">Ask AI</v-tooltip>
      </v-btn>

        <!-- Reviews Toggle -->
        <v-btn 
          icon 
          class="mr-2" 
          :color="rightDrawerOpen && rightTab === 'reviews' ? 'primary' : undefined"
          @click="toggleRightDrawer('reviews')"
        >
          <v-icon>mdi-star-box-outline</v-icon>
          <v-tooltip activator="parent" location="bottom">Read Reviews</v-tooltip>
        </v-btn>

      <!-- Comments Toggle -->
      <v-btn 
        icon 
        class="mr-2" 
        :color="rightDrawerOpen && rightTab === 'comments' ? 'primary' : undefined"
        @click="toggleRightDrawer('comments')"
      >
        <v-icon>mdi-comment-text-outline</v-icon>
        <v-tooltip activator="parent" location="bottom">Comments</v-tooltip>
      </v-btn>
      


      <login-button class="mr-4" />
    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer" 
      :temporary="!isDocked"
      :permanent="isDocked"
      width="300"
      style="padding-bottom: 52px;"
    >
      <div class="pa-4 text-center">
        <h2 class="text-h5 font-weight-bold text-primary">BUMPONOMICS</h2>
        <div class="text-caption mt-1">Problem Transforming Economics</div>
      </div>
      <v-divider class="mb-2"></v-divider>
      
      <app-drawer :items="contentItems" is-root />

      <template v-slot:append>
        <v-divider></v-divider>
        <div class="px-4 pb-4 pt-4">
          <v-switch
            v-model="isDocked"
            color="success"
            label="Dock Menu"
            hide-details
            density="compact"
            class="mb-2"
          ></v-switch>
          
          <v-divider class="mb-3"></v-divider>

          <div class="text-caption text-medium-emphasis">
            &copy; 2026 Bumponomics&trade;<br>
            All Rights Reserved.
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Right Sidebar (Unified Chat & Comments) -->
    <right-sidebar 
      v-model="rightDrawerOpen" 
      v-model:active-tab="rightTab"
    />

    <!-- Main Content Area with Background fix -->
    <v-main class="bg-background">
      <router-view />
    </v-main>

    <!-- Bottom App Bar -->
    <v-footer app border="t" height="50" class="d-flex align-center" style="z-index: 2000;">
      <div class="text-body-2 text-medium-emphasis text-truncate" style="max-width: 70%;">
        <v-icon size="small" class="mr-2">mdi-book-open-page-variant</v-icon>
        {{ currentPageTitle }}
      </div>
      
      <v-spacer></v-spacer>
      
    <!-- Theme Toggle (Moved to Bottom) -->
      <v-btn icon density="compact" variant="text" @click="toggleTheme">
        <v-icon size="small">{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        <v-tooltip activator="parent" location="top">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</v-tooltip>
      </v-btn>
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

const currentPageTitle = computed(() => {
  if (!route.params.path) return 'Home'
  const path = decodeURIComponent(route.params.path)
  const node = allNodes.find(n => n.path === path)
  return node ? (node.title || node.name) : 'Reading...'
})

// Close drawer if user logs out (optional, mainly for chat protection)
watch(user, (newUser) => {
  if (!newUser) {
    rightDrawerOpen.value = false
  }
})
</script>
