import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project config
// You can get this from the Firebase Console > Project Settings > General > Your Apps
const firebaseConfig = {
  apiKey: "AIzaSyAbsjJ38mdXazSfnk_V2rapYVcTD8fCNvM",
  authDomain: "bumponomics-10c97.firebaseapp.com",
  projectId: "bumponomics-10c97",
  storageBucket: "bumponomics-10c97.firebasestorage.app",
  messagingSenderId: "617482110520",
  appId: "1:617482110520:web:7cb9e05014dd8bb0b848cd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
