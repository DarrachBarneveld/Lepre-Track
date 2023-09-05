import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, firebaseDB } from "../../config/firebase";
import { doc, getDoc } from "@firebase/firestore";

export const checkAuthState = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        try {
          const userData = await getUserData(user);

          const profileIcon = document.getElementById("profile");
          profileIcon.innerHTML = `<i class="fa-solid fa-user"></i> ${userData.name}`;

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
      console.log(userSnapshot.data());
      return userSnapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error retrieving user data:", error);
  }
}
