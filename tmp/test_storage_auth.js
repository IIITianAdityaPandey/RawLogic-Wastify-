import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYsR5-zH3EekfFfo3oUpa9_MPJ1FIFR1Q",
  authDomain: "wastify-hub.firebaseapp.com",
  projectId: "wastify-hub",
  storageBucket: "wastify-hub.firebasestorage.app",
  messagingSenderId: "830495149425",
  appId: "1:830495149425:web:0b418a971585c797b63ad0",
  measurementId: "G-MDY78BYG7M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

async function testUploadAuth() {
  try {
    console.log("Authenticating as a test user...");
    // Attempting to sign in with a demo user or we can just try to create one if needed
    // I don't know the user's password, so I'll try catching the error and creating it
    try {
      await signInWithEmailAndPassword(auth, "test@test.com", "password123");
    } catch (e) {
      console.log("Login failed, assuming user test@test.com doesn't exist. Attempting to upload anyway, but it might fail.");
    }
    
    console.log("Authenticated User UID:", auth.currentUser?.uid);

    const testBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const imageRef = ref(storage, `materials/test_auth_${Date.now()}.jpg`);
    console.log("Attempting to upload to:", imageRef.fullPath);
    await uploadString(imageRef, testBase64, "base64", { contentType: "image/jpeg" });
    const url = await getDownloadURL(imageRef);
    console.log("Upload successful! URL:", url);
  } catch (e) {
    console.error("Storage upload error details:", e.message, e.code);
  }
}

testUploadAuth();
