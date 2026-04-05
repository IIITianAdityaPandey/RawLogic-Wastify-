import { db, storage, auth } from "../firebase/config";
import { collection, addDoc, getDocs, getDoc, deleteDoc, doc, query, where, orderBy, Timestamp, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const COLLECTION_NAME = "materials";

/**
 * Uploads a base64 image to Firebase Storage and returns its download URL.
 */
const uploadImage = async (base64Image, fileName) => {
  const imageRef = ref(storage, `materials/${fileName}_${Date.now()}.jpg`);
  await uploadString(imageRef, base64Image, "base64", { contentType: "image/jpeg" });
  return getDownloadURL(imageRef);
};

/**
 * Creates a new material listing in Firestore.
 */
export const createMaterialListing = async (materialData, base64Image) => {
  try {
    let imageUrl = null;
    if (base64Image) {
      const safeName = (materialData.name || materialData.category || "item").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      imageUrl = await uploadImage(base64Image, safeName);
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...materialData,
      image: imageUrl,
      userId: auth.currentUser?.uid || "anonymous",
      createdAt: Timestamp.now(),
      status: "Available"
    });

    return { id: docRef.id, ...materialData, image: imageUrl };
  } catch (error) {
    console.error("Firestore Create Material Error:", error);
    throw error;
  }
};

/**
 * Fetches all material listings from Firestore.
 */
export const getAllMaterials = async (categoryFilter = "All") => {
  try {
    let q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    
    if (categoryFilter !== "All") {
      q = query(collection(db, COLLECTION_NAME), where("category", "==", categoryFilter));
    }

    const querySnapshot = await getDocs(q);
    let results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));

    // In-memory sort to avoid requiring a Firebase Composite Index
    if (categoryFilter !== "All") {
        results.sort((a, b) => {
            const dateA = a.createdAt ? a.createdAt.getTime() : 0;
            const dateB = b.createdAt ? b.createdAt.getTime() : 0;
            return dateB - dateA; // Descending
        });
    }

    return results;
  } catch (error) {
    console.error("Firestore Get Materials Error:", error);
    throw error;
  }
};

/**
 * Fetches materials listed by a specific user.
 */
export const getMaterialsByUser = async (userId) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    let results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
    
    results.sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt ? b.createdAt.getTime() : 0;
        return dateB - dateA;
    });

    return results;
  } catch (error) {
    console.error("Firestore Get User Materials Error:", error);
    throw error;
  }
};

/**
 * Deletes a material from Firestore.
 */
export const deleteMaterial = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error("Firestore Delete Material Error:", error);
    throw error;
  }
};

/**
 * Updates a material in Firestore.
 */
export const updateMaterial = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // remove non-editable fields if any, or just update directly
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Firestore Update Material Error:", error);
    throw error;
  }
};

/**
 * Gets a single material by ID from Firestore.
 */
export const getMaterialById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data(), createdAt: docSnap.data().createdAt?.toDate() };
    }
    return null;
  } catch (error) {
    console.error("Firestore Get Material By ID Error:", error);
    throw error;
  }
};
