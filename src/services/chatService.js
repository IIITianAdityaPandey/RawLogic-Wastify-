import { db } from "../firebase/config";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Timestamp 
} from "firebase/firestore";

/**
 * Creates a new chat or returns an existing one between two users.
 */
export const createOrGetChat = async (userId1, userId2) => {
  try {
    const chatsRef = collection(db, "chats");
    // Check if chat already exists
    const q1 = query(chatsRef, where("participants", "==", [userId1, userId2]));
    const q2 = query(chatsRef, where("participants", "==", [userId2, userId1]));

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

    if (!snap1.empty) return { id: snap1.docs[0].id, ...snap1.docs[0].data() };
    if (!snap2.empty) return { id: snap2.docs[0].id, ...snap2.docs[0].data() };

    // Create new chat
    const newChatRef = doc(collection(db, "chats"));
    const chatData = {
      participants: [userId1, userId2],
      lastMessage: "",
      updatedAt: Timestamp.now()
    };
    await setDoc(newChatRef, chatData);
    return { id: newChatRef.id, ...chatData };
  } catch (error) {
    console.error("Error creating/getting chat:", error);
    throw error;
  }
};

/**
 * Subscribes to chat list for a user.
 */
export const subscribeToUserChats = (userId, callback) => {
  const q = query(
    collection(db, "chats"), 
    where("participants", "array-contains", userId),
    // orderBy("updatedAt", "desc") // Need index for array-contains + orderBy, skipping for now
  );

  return onSnapshot(q, (snapshot) => {
    let chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort manually to avoid index requirement
    chats.sort((a, b) => b.updatedAt?.toMillis() - a.updatedAt?.toMillis());
    callback(chats);
  });
};

/**
 * Subscribes to messages in a specific chat.
 */
export const subscribeToMessages = (chatId, callback) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

/**
 * Sends a message.
 */
export const sendMessage = async (chatId, text, senderId) => {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text,
      senderId,
      createdAt: Timestamp.now()
    });

    // Update last message in chat doc
    await setDoc(doc(db, "chats", chatId), {
      lastMessage: text,
      updatedAt: Timestamp.now()
    }, { merge: true });

  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
