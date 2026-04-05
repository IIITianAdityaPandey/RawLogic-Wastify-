import { db } from "../firebase/config";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const checkIsFollowing = async (followerId, followingId) => {
  if (!followerId || !followingId) return false;
  try {
    const relId = `${followerId}_${followingId}`;
    const docRef = doc(db, "relationships", relId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};

export const toggleFollow = async (followerId, followingId) => {
  if (!followerId || !followingId) return false;
  try {
    const relId = `${followerId}_${followingId}`;
    const docRef = doc(db, "relationships", relId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await deleteDoc(docRef);
      return false; // Now unfollowed
    } else {
      await setDoc(docRef, {
        followerId,
        followingId,
        createdAt: new Date().toISOString()
      });
      return true; // Now following
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw error;
  }
};

export const getFollowerCounts = async (userId) => {
    try {
        const followingQuery = query(collection(db, "relationships"), where("followerId", "==", userId));
        const followersQuery = query(collection(db, "relationships"), where("followingId", "==", userId));
        
        const [followingSnap, followersSnap] = await Promise.all([
            getDocs(followingQuery),
            getDocs(followersQuery)
        ]);

        return {
            following: followingSnap.size,
            followers: followersSnap.size
        };
    } catch (error) {
        console.error("Error getting follower counts:", error);
        return { following: 0, followers: 0 };
    }
};
