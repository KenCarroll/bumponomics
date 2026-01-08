<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" width="300">
      <div class="pa-4 text-center">
        <h2 class="text-h5 font-weight-bold text-amber">BUMPS.WORLD</h2>
        <div class="text-caption mt-1">The Mechanics of Problems</div>
      </div>
      <v-divider class="mb-2"></v-divider>
      
      <app-drawer :items="contentItems" />
    </v-navigation-drawer>

    <!-- Right Drawer for Comments -->
    <v-navigation-drawer v-model="commentDrawer" location="right" width="350" temporary>
      <comment-sidebar />
    </v-navigation-drawer>

    <v-app-bar flat border="b">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-light">Bumponomics</v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- AI Chat Toggle -->
      <v-btn icon color="primary" class="mr-2" @click="chatOpen = !chatOpen">
        <v-icon>mdi-robot</v-icon>
        <v-tooltip activator="parent" location="bottom">Ask AI</v-tooltip>
      </v-btn>

      <!-- Comments Toggle -->
      <v-btn icon class="mr-2" @click="commentDrawer = !commentDrawer">
        <v-icon>mdi-comment-text-outline</v-icon>
        <v-tooltip activator="parent" location="bottom">Comments</v-tooltip>
      </v-btn>
      
      <login-button class="mr-4" />
    </v-app-bar>

    <!-- Main Content Area with Background fix -->
    <v-main class="bg-background">
      <router-view />
    </v-main>

    <!-- AI Chat -->
    <chat-widget v-model="chatOpen" />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import AppDrawer from '@/components/AppDrawer.vue'
import LoginButton from '@/components/LoginButton.vue'
import CommentSidebar from '@/components/CommentSidebar.vue'
import ChatWidget from '@/components/ChatWidget.vue'
import contentItems from '@/content.json'

const drawer = ref(true)
const commentDrawer = ref(false)
const chatOpen = ref(false)
</script>
