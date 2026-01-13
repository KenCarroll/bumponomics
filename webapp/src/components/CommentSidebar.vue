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

      <v-list v-else lines="three" class="pa-2">
        <template v-for="thread in threadedComments" :key="thread.comment.id">
          <!-- Root Comment -->
          <v-card variant="outlined" class="mb-3 bg-surface">
            <v-card-text class="pb-2">
              <div class="d-flex align-center mb-2">
                <v-avatar size="24" color="surface-variant" class="mr-2">
                  <v-img v-if="thread.comment.userPhoto" :src="thread.comment.userPhoto"></v-img>
                  <span v-else>{{ thread.comment.userName?.charAt(0) }}</span>
                </v-avatar>
                <span class="text-caption font-weight-bold">{{ thread.comment.userName }}</span>
                <span class="text-caption text-disabled ml-2">{{ formatDate(thread.comment.createdAt) }}</span>
              </div>
              <p class="text-body-2 mb-2">{{ thread.comment.text }}</p>

              <!-- Reply Action -->
              <div class="d-flex" v-if="user">
                <v-btn variant="text" size="x-small" color="primary" class="px-0"
                  @click="toggleReply(thread.comment.id)">
                  Reply
                </v-btn>
              </div>

              <!-- Reply Input -->
              <div v-if="replyingTo === thread.comment.id" class="mt-2 pl-2 border-s-lg border-primary">
                <v-textarea v-model="replyText" rows="2" auto-grow variant="outlined" placeholder="Write a reply..."
                  hide-details class="mb-2" density="compact" autofocus></v-textarea>
                <div class="d-flex justify-end gap-2">
                  <v-btn size="x-small" variant="text" @click="replyingTo = null">Cancel</v-btn>
                  <v-btn size="x-small" color="primary" :disabled="!replyText.trim()" :loading="sendingReply"
                    @click="submitReply(thread.comment.id)">
                    Reply
                  </v-btn>
                </div>
              </div>
            </v-card-text>

            <!-- Nested Replies -->
            <div v-if="thread.replies.length > 0" class="bg-surface-variant pt-1 pb-1">
              <div v-for="reply in thread.replies" :key="reply.id" class="pl-4 pr-3 py-2 border-t border-dashed">
                <div class="d-flex align-center mb-1">
                  <v-avatar size="20" class="mr-2">
                    <v-img v-if="reply.userPhoto" :src="reply.userPhoto"></v-img>
                    <span v-else class="text-caption">{{ reply.userName?.charAt(0) }}</span>
                  </v-avatar>
                  <div>
                    <span class="text-caption font-weight-bold mr-2">{{ reply.userName }}</span>
                    <span class="text-caption text-disabled">{{ formatDate(reply.createdAt) }}</span>
                  </div>
                </div>
                <p class="text-body-2 ml-7">{{ reply.text }}</p>
              </div>
            </div>
          </v-card>
        </template>
      </v-list>
    </div>

    <!-- Main Input Area (New Thread) -->
    <div class="pa-3 border-t bg-surface-2" v-if="user">
      <v-textarea v-model="newComment" rows="2" auto-grow variant="outlined" placeholder="Start a new discussion..."
        hide-details class="mb-2" density="compact"></v-textarea>
      <div class="d-flex justify-end">
        <v-btn size="small" color="primary" :disabled="!newComment.trim()" :loading="sending" @click="addComment">
          Post
        </v-btn>
      </div>
    </div>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-list>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useComments } from '@/composables/useComments'


const route = useRoute()
const { user } = useAuth()
const { comments, loading, fetchComments, addComment: firestoreAddComment } = useComments()

const sending = ref(false)
const newComment = ref('')

// Reply State
const replyingTo = ref(null)
const replyText = ref('')
const sendingReply = ref(false)

const snackbar = ref({ show: false, text: '', color: 'success' })

// Threading Logic
const threadedComments = computed(() => {
  // 1. Get Roots (Newest First)
  const roots = comments.value.filter(c => !c.parentId)

  // 2. Map replies to roots
  return roots.map(root => {
    const replies = comments.value
      .filter(c => c.parentId === root.id)
      .sort((a, b) => {
        // Sort replies Oldest -> Newest (Chronological)
        const timeA = a.createdAt?.seconds || 0
        const timeB = b.createdAt?.seconds || 0
        return timeA - timeB
      })

    return {
      comment: root,
      replies: replies
    }
  })
})

// Fetch call wrapper
const loadComments = () => {
  const path = route.params.path || 'home'
  console.log('Sidebar fetching comments for:', path)
  fetchComments(path)
}

const addComment = async () => {
  if (!newComment.value.trim() || !user.value) return

  sending.value = true
  try {
    const path = route.params.path || 'home'
    await firestoreAddComment(path, newComment.value, user.value) // ParentId is null

    newComment.value = ''
    snackbar.value = { show: true, text: 'Comment posted!', color: 'success' }
  } catch (e) {
    console.error("Error adding comment", e)
    snackbar.value = { show: true, text: 'Failed to post: ' + e.message, color: 'error' }
  } finally {
    sending.value = false
  }
}

// Reply Actions
const toggleReply = (commentId) => {
  if (replyingTo.value === commentId) {
    replyingTo.value = null
  } else {
    replyingTo.value = commentId
    replyText.value = ''
  }
}

const submitReply = async (parentId) => {
  if (!replyText.value.trim() || !user.value) return

  sendingReply.value = true
  try {
    const path = route.params.path || 'home'
    await firestoreAddComment(path, replyText.value, user.value, parentId)

    replyingTo.value = null
    replyText.value = ''
    snackbar.value = { show: true, text: 'Reply posted!', color: 'success' }
  } catch (e) {
    console.error("Error adding reply", e)
    snackbar.value = { show: true, text: 'Failed to reply: ' + e.message, color: 'error' }
  } finally {
    sendingReply.value = false
  }
}


const formatDate = (timestamp) => {
  if (!timestamp) return ''
  // Handle Firestore Timestamp or Date
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp)
  return date.toLocaleDateString()
}

// Reactivity
watch(() => route.params.path, loadComments)
watch(user, loadComments)

onMounted(() => {
  console.log('CommentSidebar mounted. Fetching comments...')
  loadComments()
})
</script>
