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

              <!-- Progress Bar -->
              <v-hover v-slot="{ isHovering, props }">
                <div class="mt-4 mb-2 w-100 cursor-pointer" v-bind="props" @click="router.push('/progress')"
                  :style="{ opacity: isHovering ? 0.7 : 1, transition: 'opacity 0.2s' }">
                  <div class="d-flex justify-space-between text-caption mb-1">
                    <span class="font-weight-bold text-primary">Book Progress</span>
                    <span>{{ progressPercentage }}%</span>
                  </div>
                  <v-progress-linear :model-value="progressPercentage" color="success" height="6"
                    rounded></v-progress-linear>
                  <div class="d-flex justify-space-between text-caption text-medium-emphasis mt-1"
                    style="font-size: 0.7rem;">
                    <span>{{ progressCount }} completed</span>
                    <span class="text-primary text-decoration-underline">Manage</span>
                  </div>
                </div>
              </v-hover>

              <v-divider class="my-3"></v-divider>

              <!-- Subscription Status -->
              <v-btn v-if="!isSubscribed" rounded variant="tonal" color="primary" class="mb-3 w-100"
                :loading="subLoading" @click.stop="handleSubscribe">
                <v-icon start icon="mdi-email-plus-outline"></v-icon>
                Subscribe
              </v-btn>

              <div v-else class="mb-3">
                <v-btn rounded variant="text" color="success" class="w-100 mb-1" prepend-icon="mdi-check-circle"
                  readonly>
                  Subscribed
                </v-btn>
                <div class="text-caption text-medium-emphasis text-decoration-underline cursor-pointer"
                  @click.stop="handleUnsubscribe">
                  Unsubscribe
                </div>
              </div>

              <v-btn rounded variant="text" to="/faqs" class="mb-1 w-100" color="primary">
                <v-icon icon="mdi-forum-outline" start></v-icon>Q&A Dashboard
              </v-btn>

              <v-divider class="my-2"></v-divider>

              <v-btn rounded variant="text" @click="signOut" class="w-100">
                <v-icon icon="mdi-logout" start></v-icon>Logout
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>

    <template v-else>
      <v-btn color="primary" variant="tonal" prepend-icon="mdi-google" :loading="loading" @click="signInWithGoogle">
        Login
      </v-btn>

      <div v-if="error" class="text-caption text-error ml-2">
        {{ error }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNewsletter } from '@/composables/useNewsletter'
import { useProgress } from '@/composables/useProgress'

const router = useRouter()
const { user, loading, error, signInWithGoogle, signOut } = useAuth()
const { subscribe, unsubscribe, checkSubscriptionStatus, isSubscribed, loading: subLoading } = useNewsletter()
const { progressPercentage, progressCount } = useProgress()

const handleSubscribe = async () => {
  if (user.value?.email) {
    await subscribe(user.value.email)
    await checkSubscriptionStatus(user.value.email)
  }
}

const handleUnsubscribe = async () => {
  if (user.value?.email) {
    await unsubscribe(user.value.email)
    // isSubscribed is updated inside useNewsletter, but consistent re-check doesn't hurt
    await checkSubscriptionStatus(user.value.email)
  }
}

// Check status whenever user changes or component mounts
watch(user, async (newUser) => {
  if (newUser?.email) {
    await checkSubscriptionStatus(newUser.email)
  } else {
    isSubscribed.value = false
  }
}, { immediate: true })
</script>
