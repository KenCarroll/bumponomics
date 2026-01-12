import { ref } from 'vue'
import { db } from '../firebase'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore'

export function useFAQ() {
  const faqs = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Keep track of the unsubscribe function to stop listening when component unmounts or page changes
  let unsubscribe = null

  const fetchFAQs = (pagePath = null) => {
    // Clear previous state
    faqs.value = []
    loading.value = true
    error.value = null
    
    // Unsubscribe from previous listener if exists
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    try {
      let q;
      if (pagePath) {
        q = query(
          collection(db, 'faqs'),
          where('pagePath', '==', pagePath),
          orderBy('createdAt', 'desc')
        )
      } else {
        // Fetch all (global dashboard)
        // May limit to recent 100
        q = query(
          collection(db, 'faqs'),
          orderBy('createdAt', 'desc')
        )
      }

      // Real-time listener
      unsubscribe = onSnapshot(q, (snapshot) => {
        faqs.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        loading.value = false
      }, (err) => {
        console.error("Error fetching FAQs:", err)
        error.value = err.message
        loading.value = false
      })
    } catch (e) {
      console.error("Error setting up FAQ listener:", e)
      error.value = e.message
      loading.value = false
    }
  }

  const addQuestion = async (pagePath, questionText, user) => {
    if (!questionText.trim()) return

    try {
      await addDoc(collection(db, 'faqs'), {
        pagePath,
        question: questionText,
        answer: null, // No answer yet
        isPublic: true, // Default to public for now
        userId: user ? user.uid : 'anonymous',
        userDisplayName: user ? user.displayName : 'Anonymous',
        createdAt: serverTimestamp(),
        answered: false
      })
      return true
    } catch (e) {
      console.error("Error adding question:", e)
      throw e
    }
  }

  const answerQuestion = async (faqId, answerText, user) => {
    if (!answerText.trim()) return
    // TODO: Add check for admin usage
    try {
      // We need to import doc and updateDoc
      const { doc, updateDoc } = await import("firebase/firestore")
      const faqRef = doc(db, 'faqs', faqId)
      await updateDoc(faqRef, {
        answer: answerText,
        answered: true,
        answeredBy: user ? user.displayName : 'Admin',
        answeredAt: serverTimestamp()
      })
    } catch (e) {
      console.error("Error answering question:", e)
      throw e
    }
  }

  // Cleanup helper
  const stopListening = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  // Notification Logic
  const unansweredCount = ref(0)
  let notificationUnsubscribe = null

  const listenUnanswered = () => {
    // Only set up one listener
    if (notificationUnsubscribe) return

    const q = query(
      collection(db, 'faqs'),
      where('answered', '==', false)
    )

    notificationUnsubscribe = onSnapshot(q, (snapshot) => {
      unansweredCount.value = snapshot.size
    }, (err) => {
      console.error("Error listening for notifications:", err)
    })
  }

  return {
    faqs,
    loading,
    error,
    unansweredCount,
    fetchFAQs,
    addQuestion,
    answerQuestion,
    listenUnanswered,
    stopListening
  }
}
