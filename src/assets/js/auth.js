import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, firebaseDB } from "../../config/firebase";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";

export const checkAuthState = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        try {
          resolve(user);
        } catch (error) {
          console.error("Error getting user data:", error);
          reject(error);
        }
      } else {
        console.log("User is not logged in");
        resolve(null);
      }
    });
  });
};

checkAuthState();

export async function getUserData(user) {
  try {
    const userRef = doc(firebaseDB, "users", user.uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error retrieving user data:", error);
  }
}

export async function getAllUserDocuments() {
  try {
    const userCollectionRef = collection(firebaseDB, "users");
    const querySnapshot = await getDocs(userCollectionRef);

    const users = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push(data);
    });

    return users;
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}
