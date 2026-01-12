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
      
      const result = await Promise.race([
        signInWithPopup(auth, provider),
        timeoutPromise
      ]);
      console.log("Sign in success");
      
      // Sync user profile to Firestore
      if (result.user) {
        try {
          const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
          const { db } = await import("../firebase");
          
          const userRef = doc(db, 'users', result.user.uid);
          await setDoc(userRef, {
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            email: result.user.email, // Keep email for admin/debugging, maybe hide in UI
            lastLogin: serverTimestamp(),
            // Only set joinedAt if not exists (using merge)
            // But we can't condition on existence easily in one setDoc merge without check.
            // Actually, we can just set it. If we want "joinedAt" strictly first time, we check.
            // For simplicity, let's just use metadata or set it if missing.
          }, { merge: true });
          
          // Separate check for joinedAt to not overwrite it
          // OR simpler: just write lastLogin and profile updates.
          // Let's assume metadata verification is enough, but for display "Joined ..." 
          // we can check creationTime from auth metadata usually.
          // Let's write "joinedAt" if it's new.
          if (result.user.metadata.creationTime) {
             await setDoc(userRef, {
                joinedAt: result.user.metadata.creationTime
             }, { merge: true });
          }

        } catch (dbError) {
          console.error("Failed to sync user profile", dbError);
          // Don't fail login just because DB sync failed
        }
      }

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
