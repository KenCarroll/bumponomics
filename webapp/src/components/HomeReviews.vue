<template>
  <v-container>
    <div class="mb-12">
      <div class="d-flex align-center justify-center position-relative">
        <h3 class="text-h5 font-weight-bold text-center">WHAT READERS ARE SAYING</h3>

        <!-- Desktop Button: Absolute Right -->
        <v-btn v-if="user" color="primary" variant="text" prepend-icon="mdi-pencil"
          class="d-none d-md-flex position-absolute right-0" @click="dialog = true">
          Write a Review
        </v-btn>
      </div>

      <!-- Mobile Button: Centered Below -->
      <div v-if="user" class="d-flex d-md-none justify-center mt-4">
        <v-btn color="primary" variant="text" prepend-icon="mdi-pencil" @click="dialog = true">
          Write a Review
        </v-btn>
      </div>
    </div>

    <!-- Error State -->
    <v-alert v-if="error" type="error" variant="tonal" class="mb-6" closable>
      {{ error }}
      <template v-slot:append>
        <v-btn size="small" variant="text" @click="fetchReviews()">Retry</v-btn>
      </template>
    </v-alert>

    <!-- Loading State -->
    <v-row v-if="loading && reviews.length === 0">
      <v-col v-for="n in 3" :key="n" cols="12" md="4">
        <v-skeleton-loader type="card" class="bg-surface"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Content State -->
    <v-row v-else-if="reviews.length > 0">
      <v-col v-for="review in reviews" :key="review.id" cols="12" md="4">
        <v-card class="fill-height pa-4 d-flex flex-column" color="surface" elevation="0" border>
          <!-- Rating -->
          <div class="d-flex mb-4 text-primary">
            <v-icon v-for="i in 5" :key="i" size="small"
              :icon="i <= review.rating ? 'mdi-star' : 'mdi-star-outline'"></v-icon>
          </div>

          <!-- Text -->
          <p class="text-body-2 font-italic mb-4 flex-grow-1">"{{ review.text }}"</p>

          <!-- Author -->
          <div class="text-caption font-weight-bold d-flex justify-space-between align-center">
            <span>– {{ review.authorName || 'Anonymous' }}</span>
            <span class="text-caption text-disabled">{{ formatDate(review.createdAt) }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-medium-emphasis">
      <v-icon size="48" class="mb-4 text-disabled">mdi-message-text-outline</v-icon>
      <p>No reviews yet. Be the first to share your thoughts!</p>
      <v-btn v-if="!user" color="primary" variant="text" class="mt-2" @click="emitLoginRequest">
        Log in to Review
      </v-btn>
    </div>

    <!-- Write Review Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Write a Review</v-card-title>
        <v-card-text>
          <v-rating v-model="newRating" color="primary" hover class="mb-4"></v-rating>

          <v-textarea v-model="newText" label="Your thoughts..." rows="3" variant="outlined"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" :loading="submitting" :disabled="!newText || newRating === 0" @click="submitReview">
            Post
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReviews } from '@/composables/useReviews'
import { useAuth } from '@/composables/useAuth'

const { reviews, loading, error, fetchReviews, addReview } = useReviews()
const { user } = useAuth()

const dialog = ref(false)
const newRating = ref(0)
const newText = ref('')
const submitting = ref(false)

const emit = defineEmits(['request-login'])

const emitLoginRequest = () => {
  // We might want to trigger the login flow from parent or global state
  // For now, assuming user knows where the login button is
}

const formatDate = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
}

const submitReview = async () => {
  if (!user.value) return

  submitting.value = true
  const success = await addReview({
    rating: newRating.value,
    text: newText.value,
    authorName: user.value.displayName || 'Reader',
    authorId: user.value.uid
  })

  if (success) {
    dialog.value = false
    newRating.value = 0
    newText.value = ''
  }
  submitting.value = false
}

onMounted(() => {
  fetchReviews()
})
</script>
