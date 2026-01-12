import { ref, computed, watch } from 'vue'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './useAuth'

const completedPaths = ref([])
const loading = ref(false)
const error = ref(null)
const totalPages = ref(0) // Logic to set this needs access to content tree

// Global user watcher to reset/fetch progress
const { user } = useAuth()

const fetchProgress = async (uid) => {
  if (!uid) return
  loading.value = true
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      completedPaths.value = userSnap.data().completedPaths || []
    } else {
      // Initialize user doc if it doesn't exist
      await setDoc(userRef, { completedPaths: [] }, { merge: true })
      completedPaths.value = []
    }
  } catch (e) {
    console.error("Error fetching progress:", e)
    error.value = e.message
  } finally {
    loading.value = false
  }
}

watch(user, async (newUser) => {
  if (newUser) {
    await fetchProgress(newUser.uid)
  } else {
    completedPaths.value = []
  }
})

export function useProgress() {


  const togglePageCompletion = async (path) => {
    if (!user.value) return 
    if (!path) return

    const uid = user.value.uid
    const userRef = doc(db, 'users', uid)
    const isCompleted = completedPaths.value.includes(path)

    try {
      if (isCompleted) {
        // Remove locally immediately for UI responsiveness
        completedPaths.value = completedPaths.value.filter(p => p !== path)
        await updateDoc(userRef, {
          completedPaths: arrayRemove(path)
        })
      } else {
        // Add locally
        completedPaths.value = [...completedPaths.value, path]
        await updateDoc(userRef, {
          completedPaths: arrayUnion(path)
        })
      }
    } catch (e) {
      console.error("Error toggling page completion:", e)
      // Revert on error? For now, just log.
      // Ideally re-fetch or revert local change
      await fetchProgress(uid)
    }
  }

  const updateAllProgress = async (newCompletedPaths) => {
    if (!user.value) return 
    const uid = user.value.uid
    const userRef = doc(db, 'users', uid)
    
    loading.value = true
    try {
      completedPaths.value = newCompletedPaths
      await updateDoc(userRef, {
        completedPaths: newCompletedPaths
      })
    } catch (e) {
      console.error("Error batch updating progress:", e)
      error.value = e.message
      await fetchProgress(uid) // Revert on error
    } finally {
      loading.value = false
    }
  }

  const isPageCompleted = (path) => {
    return completedPaths.value.includes(path)
  }

  // Set total pages from outside (e.g. from App.vue or where content is loaded)
  const setTotalPages = (count) => {
    totalPages.value = count
  }
  
  const progressPercentage = computed(() => {
    if (totalPages.value === 0) return 0
    return Math.round((completedPaths.value.length / totalPages.value) * 100)
  })

  // Ensure progress is fetched if user is already logged in when composable is used
  if (user.value && completedPaths.value.length === 0 && !loading.value) {
     fetchProgress(user.value.uid)
  }

  return {
    completedPaths,
    loading,
    error,
    togglePageCompletion,
    updateAllProgress,
    isPageCompleted,
    setTotalPages,
    progressCount: computed(() => completedPaths.value.length),
    progressPercentage
  }
}
