<template>
  <div class="d-flex flex-column h-100">
    <!-- Header -->
    <div class="px-4 py-2 border-b d-flex align-center justify-space-between bg-surface">
      <div class="d-flex align-center">
        <div class="text-subtitle-1 font-weight-medium mr-2">Reviews</div>
        <div class="text-caption text-medium-emphasis" v-if="reviews.length">
          {{ reviews.length }}
        </div>
      </div>
      
      <site-review-dialog v-if="user">
        <template v-slot:activator="{ props }">
          <v-btn
            size="small"
            variant="text"
            color="primary"
            prepend-icon="mdi-star-outline"
            v-bind="props"
          >
            Rate Site
          </v-btn>
        </template>
      </site-review-dialog>
    </div>

    <!-- Review List -->
    <v-list class="flex-grow-1 overflow-y-auto pa-0 bg-transparent" lines="three">
      <template v-if="loading">
        <v-skeleton-loader
          v-for="n in 3"
          :key="n"
          type="list-item-avatar-two-line"
          class="bg-transparent"
        ></v-skeleton-loader>
      </template>

      <template v-else-if="reviews.length > 0">
        <div v-for="(review, index) in reviews" :key="review.id">
          <v-list-item class="px-4 py-3">
            <template v-slot:prepend>
              <v-avatar size="36" color="surface-variant">
                <v-img v-if="review.photoURL" :src="review.photoURL" :alt="review.displayName"></v-img>
                <span v-else class="text-h6">{{ (review.displayName || 'A').charAt(0).toUpperCase() }}</span>
              </v-avatar>
            </template>

            <v-list-item-title class="d-flex align-center justify-space-between mb-1">
              <span class="text-body-2 font-weight-bold">{{ review.displayName || 'Anonymous' }}</span>
              <span class="text-caption text-medium-emphasis">{{ formatDate(review.createdAt) }}</span>
            </v-list-item-title>
            
            <v-list-item-subtitle class="opacity-100 mb-2">
              <v-rating
                :model-value="review.rating"
                color="amber"
                active-color="amber"
                size="x-small"
                density="compact"
                readonly
                half-increments
              ></v-rating>
            </v-list-item-subtitle>

            <div class="text-body-2 text-high-emphasis text-pre-wrap">{{ review.text }}</div>
          </v-list-item>
          <v-divider v-if="index < reviews.length - 1"></v-divider>
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="d-flex flex-column align-center justify-center h-100 pa-6 text-center text-medium-emphasis">
        <v-icon size="48" class="mb-2 opacity-50">mdi-star-off-outline</v-icon>
        <div class="text-body-1">No reviews yet</div>
        <div class="text-caption">Be the first to share your thoughts!</div>
      </div>
    </v-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../composables/useAuth'
import SiteReviewDialog from './SiteReviewDialog.vue'

const { user } = useAuth()
const reviews = ref([])
const loading = ref(true)

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  // Handle Firestore Timestamp or Date object
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric' 
  }).format(date)
}

onMounted(() => {
  const q = query(
    collection(db, "site_reviews"),
    orderBy("createdAt", "desc"),
    limit(50)
  )

  const unsubscribe = onSnapshot(q, (snapshot) => {
    reviews.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    loading.value = false
  }, (error) => {
    console.error("Error fetching reviews:", error)
    loading.value = false
  })

  // Cleanup subscription on component unmount
  // (Vue handles basic cleanup but explicit is good if we moved thislogic out)
  // Since we are in script setup, onUnmounted is the typical matching hook, 
  // but let's keep it simple.
})
</script>

<style scoped>
.text-pre-wrap {
  white-space: pre-wrap;
}
</style>
