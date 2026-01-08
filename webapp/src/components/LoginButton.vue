<template>
  <div class="d-flex align-center">
    <template v-if="user">
      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="brown" size="small">
              <v-img v-if="user.photoURL" :src="user.photoURL" alt="Avatar"></v-img>
              <span v-else class="text-h6">{{ user.displayName?.charAt(0) || 'U' }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <h3>{{ user.displayName }}</h3>
              <p class="text-caption mt-1">{{ user.email }}</p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="signOut">
                <v-icon icon="mdi-logout"></v-icon>Logout
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>

    <template v-else>
      <v-btn 
        color="primary" 
        variant="tonal" 
        prepend-icon="mdi-google"
        :loading="loading"
        @click="signInWithGoogle"
      >
        Login
      </v-btn>
      
      <div v-if="error" class="text-caption text-error ml-2">
        {{ error }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { user, loading, error, signInWithGoogle, signOut } = useAuth()
</script>
