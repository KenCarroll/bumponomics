import { ref } from 'vue'
import { db } from '@/firebase'
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore'

export function useReviews() {
  const reviews = ref([])
  const loading = ref(false)
  const error = ref(null)

// Fetch recent reviews
  const fetchReviews = async (max = 6) => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        collection(db, 'site_reviews'),
        orderBy('createdAt', 'desc'),
        limit(max)
      )
      
      const querySnapshot = await getDocs(q)
      console.log('Fetched reviews count:', querySnapshot.size)
      reviews.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Map displayName to authorName for compatibility if needed, or update component
        authorName: doc.data().displayName || 'Anonymous',
        // Convert timestamp to Date object if it exists
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }))
    } catch (e) {
      console.error('Error fetching reviews:', e)
      error.value = `Failed to load reviews: ${e.message}`
    } finally {
      loading.value = false
    }
  }

  // Add a new review
  const addReview = async (reviewData) => {
    loading.value = true
    error.value = null
    try {
      // Map authorName back to displayName for consistency
      const dataToSave = {
        ...reviewData,
        displayName: reviewData.authorName, // Save as displayName
        createdAt: serverTimestamp()
      }
      delete dataToSave.authorName // clean up

      await addDoc(collection(db, 'site_reviews'), dataToSave)
      // Refresh list
      await fetchReviews()
      return true
    } catch (e) {
      console.error('Error adding review:', e)
      error.value = 'Failed to post review.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    addReview
  }
}
