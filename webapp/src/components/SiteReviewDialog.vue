<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props }">
      <slot name="activator" :props="props"></slot>
    </template>

    <v-card>
      <v-card-title class="text-h5 bg-primary text-white">
        {{ existingReviewId ? 'Edit Your Review' : 'Rate BUMPONOMICS' }}
      </v-card-title>

      <v-card-text class="pt-4">
        <div class="d-flex flex-column align-center mb-4">
          <div class="text-body-1 mb-2">How would you rate your experience?</div>
          <v-rating
            v-model="rating"
            color="amber"
            active-color="amber"
            hover
            size="large"
          ></v-rating>
        </div>

        <v-textarea
          v-model="reviewText"
          label="Tell us what you think (optional)"
          variant="outlined"
          auto-grow
          rows="3"
          hide-details="auto"
          :counter="500"
          :rules="[v => v.length <= 500 || 'Max 500 characters']"
        ></v-textarea>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mt-4"
          closable
          @click:close="error = null"
        >
          {{ error }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="existingReviewId"
          color="error"
          variant="text"
          @click="deleteReview"
          :loading="loading"
        >
          Delete
        </v-btn>
        
        <v-spacer></v-spacer>
        
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="close"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submitReview"
          :loading="loading"
          :disabled="rating === 0"
        >
          {{ existingReviewId ? 'Update Review' : 'Submit Review' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="showSuccess" :color="successColor" timeout="3000">
    {{ successMessage }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="showSuccess = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../composables/useAuth'

const dialog = ref(false)
const rating = ref(0)
const reviewText = ref('')
const loading = ref(false)
const error = ref(null)
const showSuccess = ref(false)
const successMessage = ref('')
const successColor = ref('success')

const existingReviewId = ref(null)

const { user } = useAuth()

// Fetch existing review when dialog opens
watch(dialog, async (isOpen) => {
  if (isOpen && user.value) {
    loading.value = true
    try {
      const q = query(
        collection(db, "site_reviews"), 
        where("uid", "==", user.value.uid)
      )
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0]
        existingReviewId.value = docSnap.id
        const data = docSnap.data()
        rating.value = data.rating
        reviewText.value = data.text
      } else {
        resetForm()
      }
    } catch (e) {
      console.error("Error fetching existing review:", e)
    } finally {
      loading.value = false
    }
  }
})

const resetForm = () => {
  existingReviewId.value = null
  rating.value = 0
  reviewText.value = ''
  error.value = null
}

const close = () => {
  dialog.value = false
  // Don't reset immediately so animation looks clean
}

const submitReview = async () => {
  if (!user.value) return
  if (rating.value === 0) {
    error.value = "Please select a star rating."
    return
  }

  loading.value = true
  error.value = null

  try {
    const reviewData = {
      uid: user.value.uid,
      displayName: user.value.displayName,
      photoURL: user.value.photoURL,
      rating: rating.value,
      text: reviewText.value,
      updatedAt: serverTimestamp(),
      userAgent: navigator.userAgent
    }

    if (existingReviewId.value) {
      // Update
      await updateDoc(doc(db, "site_reviews", existingReviewId.value), reviewData)
      successMessage.value = "Review updated successfully!"
    } else {
      // Create
      reviewData.createdAt = serverTimestamp()
      await addDoc(collection(db, "site_reviews"), reviewData)
      successMessage.value = "Thank you for your review!"
    }

    successColor.value = 'success'
    showSuccess.value = true
    close()
  } catch (e) {
    console.error("Error saving review: ", e)
    error.value = "Failed to save review. Please try again."
  } finally {
    loading.value = false
  }
}

const deleteReview = async () => {
  if (!existingReviewId.value) return
  
  if (!confirm("Are you sure you want to delete your review?")) return

  loading.value = true
  try {
    await deleteDoc(doc(db, "site_reviews", existingReviewId.value))
    successMessage.value = "Review deleted."
    successColor.value = 'info'
    showSuccess.value = true
    existingReviewId.value = null // Clear ID so it doesn't think we still have one
    close()
  } catch (e) {
    console.error("Error deleting review: ", e)
    error.value = "Failed to delete review."
  } finally {
    loading.value = false
  }
}
</script>
