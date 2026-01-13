import { ref, onUnmounted } from 'vue'
import { db } from '@/firebase'
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc, 
  serverTimestamp 
} from "firebase/firestore"

export function useComments() {
  const comments = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  let unsubscribe = null

  const fetchComments = (pagePath) => {
    // Cleanup previous listener
    if (unsubscribe) unsubscribe()
    
    // Reset state
    comments.value = []
    loading.value = true
    error.value = null

    if (!pagePath) {
      loading.value = false
      return
    }

    try {
      const q = query(
        collection(db, "comments"),
        where("pagePath", "==", pagePath)
      )

      unsubscribe = onSnapshot(q, (snapshot) => {
        const rawComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Client-side sort to handle local writes/timestamps better
        comments.value = rawComments.sort((a, b) => {
          const timeA = a.createdAt?.seconds || Date.now() / 1000
          const timeB = b.createdAt?.seconds || Date.now() / 1000
          return timeB - timeA // Descending
        })
        
        loading.value = false
      }, (err) => {
        console.error("Error fetching comments:", err)
        error.value = err.message
        loading.value = false
      })
    } catch (e) {
      console.error("Error setting up listener:", e)
      error.value = e.message
      loading.value = false
    }
  }

  const addComment = async (pagePath, text, user, parentId = null) => {
    if (!text?.trim() || !user || !pagePath) return false

    try {
      const payload = {
        text: text,
        pagePath: pagePath,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        createdAt: serverTimestamp(),
        parentId: parentId
      }
      
      await addDoc(collection(db, "comments"), payload)
      return true
    } catch (e) {
      console.error("Error adding comment", e)
      throw e
    }
  }

  // Cleanup on component unmount
  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment
  }
}
