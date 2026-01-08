import { ref, onMounted } from 'vue'
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../firebase";

const user = ref(null);

// Listen for auth state changes once globally
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

export function useAuth() {
  const loading = ref(false);
  const error = ref(null);

  const signInWithGoogle = async () => {
    loading.value = true;
    error.value = null;
    try {
      const provider = new GoogleAuthProvider();
      console.log("Starting sign in with popup...");
      
      // key is adding a timeout so it doesn't spin forever
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Login timed out. Pop-up might be blocked or closed.")), 15000)
      );
      
      await Promise.race([
        signInWithPopup(auth, provider),
        timeoutPromise
      ]);
      console.log("Sign in success");
    } catch (e) {
      error.value = e.message;
      console.error("Login failed", e);
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut
  };
}
