<template>
  <v-list class="fill-height d-flex flex-column pa-0">
    <v-list-subheader class="bg-surface-2 pa-4 font-weight-bold border-b">
      Comments
      <v-spacer></v-spacer>
      <v-chip size="x-small" v-if="comments.length">{{ comments.length }}</v-chip>
    </v-list-subheader>

    <!-- Comments List -->
    <div class="flex-grow-1 overflow-y-auto" style="min-height: 200px;">
      <div v-if="!user" class="pa-6 text-center text-grey">
        <v-icon size="40" class="mb-2">mdi-account-lock-outline</v-icon>
        <p>Login to view and join the discussion.</p>
      </div>

      <div v-else-if="loading" class="d-flex justify-center pa-4">
        <v-progress-circular indeterminate size="24"></v-progress-circular>
      </div>

      <div v-else-if="comments.length === 0" class="pa-6 text-center text-grey">
        <v-icon size="40" class="mb-2">mdi-comment-outline</v-icon>
        <p>No comments yet. Be the first!</p>
      </div>

      <v-list v-else lines="three">
        <template v-for="comment in comments" :key="comment.id">
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar size="32" color="surface-variant">
                <v-img v-if="comment.userPhoto" :src="comment.userPhoto"></v-img>
                <span v-else>{{ comment.userName?.charAt(0) }}</span>
              </v-avatar>
            </template>
            <v-list-item-title class="text-caption font-weight-bold">
              {{ comment.userName }}
              <span class="text-grey ml-2">{{ formatDate(comment.createdAt) }}</span>
            </v-list-item-title>
            <p class="text-body-2 mt-1">{{ comment.text }}</p>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-list>
    </div>

    <!-- Input Area -->
    <div class="pa-3 border-t bg-surface-2" v-if="user">
      <v-textarea
        v-model="newComment"
        rows="2"
        auto-grow
        variant="outlined"
        placeholder="Add a comment..."
        hide-details
        class="mb-2"
        density="compact"
      ></v-textarea>
      <div class="d-flex justify-end">
        <v-btn 
          size="small" 
          color="primary" 
          :disabled="!newComment.trim()"
          :loading="sending"
          @click="addComment"
        >
          Post
        </v-btn>
      </div>
    </div>
  </v-list>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { db } from '@/firebase'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc, 
  serverTimestamp 
} from "firebase/firestore"

const route = useRoute()
const { user } = useAuth()

const comments = ref([])
const loading = ref(false)
const sending = ref(false)
const newComment = ref('')

let unsubscribe = null

// Load comments for current path
const fetchComments = () => {
  if (unsubscribe) unsubscribe()
  comments.value = []
  
  if (!user.value) return
  
  loading.value = true
  const path = route.params.path || 'home'
  
  // Remove orderBy to avoid needing a composite index during dev
  const q = query(
    collection(db, "comments"),
    where("pagePath", "==", path)
    // orderBy("createdAt", "desc") <-- This requires an index
  )

  unsubscribe = onSnapshot(q, (snapshot) => {
    const rawComments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Client-side sort instead
    comments.value = rawComments.sort((a, b) => {
      // Handle potential null timestamps (local writes)
      const timeA = a.createdAt?.seconds || Date.now() / 1000
      const timeB = b.createdAt?.seconds || Date.now() / 1000
      return timeB - timeA // Descending
    })
    
    loading.value = false
  }, (err) => {
    console.error("Error fetching comments:", err)
    loading.value = false
  })
}

const addComment = async () => {
  if (!newComment.value.trim() || !user.value) return
  
  sending.value = true
  try {
    await addDoc(collection(db, "comments"), {
      text: newComment.value,
      pagePath: route.params.path || 'home',
      userId: user.value.uid,
      userName: user.value.displayName,
      userPhoto: user.value.photoURL,
      createdAt: serverTimestamp()
    })
    newComment.value = ''
  } catch (e) {
    console.error("Error adding comment", e)
  } finally {
    sending.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp.seconds * 1000).toLocaleDateString()
}

// Reactivity
watch(() => route.params.path, fetchComments)
watch(user, fetchComments)

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>
