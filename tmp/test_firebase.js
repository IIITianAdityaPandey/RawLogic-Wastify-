import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

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
const db = getFirestore(app);

async function testWrite() {
  try {
    const docRef = await addDoc(collection(db, "materials"), {
      name: "Test Material",
      createdAt: Timestamp.now(),
      status: "Available"
    });
    console.log("Document written with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding document:", e);
  }
}

testWrite();
