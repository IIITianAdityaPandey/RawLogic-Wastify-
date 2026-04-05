import { auth, db } from "../firebase/config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Register a new user and create their profile in Firestore.
 */
export const registerUser = async (name, email, password, userType) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      userType, // 'seller' or 'buyer'
      createdAt: new Date().toISOString()
    });

    return user;
  } catch (error) {
    console.error("Firebase Register Error:", error);
    throw error;
  }
};

/**
 * Sign in an existing user.
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Login Error:", error);
    throw error;
  }
};

/**
 * Sign out the current user.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase Logout Error:", error);
    throw error;
  }
};

/**
 * Get the current user's profile from Firestore.
 */
export const getUserProfile = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Firebase Get Profile Error:", error);
    throw error;
  }
};
