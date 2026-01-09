import { ref } from 'vue'
import { db } from '@/firebase'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore'

export function useNewsletter() {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  const subscribe = async (email) => {
    loading.value = true
    error.value = null
    success.value = false
    
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address.')
      }

      // Check for duplicates
      const q = query(
        collection(db, 'subscribers'),
        where('email', '==', email)
      )
      const existing = await getDocs(q)
      
      if (!existing.empty) {
        success.value = true // Pretend success to avoid leaking info/privacy
        return true
      }

      // Add to database
      await addDoc(collection(db, 'subscribers'), {
        email,
        createdAt: serverTimestamp(),
        source: 'home_page'
      })

      // TRIGGER WELCOME EMAIL (handled by Extension)
      await addDoc(collection(db, 'mail'), {
        to: email,
        message: {
          subject: 'Welcome to Bumponomics!',
          text: 'Thanks for subscribing. We are glad to have you on the journey to transform problems into progress.',
          html: `
            <h1>Welcome to Bumponomics!</h1>
            <p>Thanks for subscribing. We are glad to have you on the journey to transform problems into <strong>Progress</strong>.</p>
            <p>- The Bumponomics Team</p>
          `
        }
      })
      
      success.value = true
      return true
    } catch (e) {
      console.error('Newsletter error:', e)
      error.value = e.message || 'Failed to subscribe. Please try again later.'
      return false
    } finally {
      loading.value = false
    }
  }

  const unsubscribe = async (email) => {
    loading.value = true
    try {
      const q = query(
        collection(db, 'subscribers'),
        where('email', '==', email)
      )
      const querySnapshot = await getDocs(q)
      
      const deletions = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletions)
      
      isSubscribed.value = false
      return true
    } catch (e) {
      console.error('Unsubscribe error:', e)
      error.value = 'Failed to unsubscribe.'
      return false
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    error.value = null
    success.value = false
    loading.value = false
  }

  const isSubscribed = ref(false)

  const checkSubscriptionStatus = async (email) => {
    if (!email) {
      isSubscribed.value = false
      return false
    }
    
    try {
      const q = query(
        collection(db, 'subscribers'),
        where('email', '==', email)
      )
      const existing = await getDocs(q)
      isSubscribed.value = !existing.empty
      return isSubscribed.value
    } catch (e) {
      console.error('Check subscription error:', e)
      return false
    }
  }

  return {
    subscribe,
    unsubscribe,
    reset,
    checkSubscriptionStatus,
    loading,
    error,
    success,
    isSubscribed
  }
}
