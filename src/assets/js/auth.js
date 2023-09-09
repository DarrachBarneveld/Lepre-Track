import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth, firebaseDB } from "../../config/firebase";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { AuthNavBar } from "../components/Navbar";
import Swal from "sweetalert2";

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

export function renderAuthenticatedNavBar(user) {
  const navAuth = document.getElementById("authenticated");
  const html = AuthNavBar(user);

  navAuth.innerHTML = html;

  const navbarList = document.getElementById("navbar-list");

  const categoriesBtnHtml = `
    <li class="nav-item">
    <div class="dropdown">
      <button
        class="nav-link btn btn-success text-white m-1 ms-0 mx-2 px-3"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Categories <i class="fa-solid fa-sitemap"></i>
      </button>
      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" href="transport.html">Travel</a>
        </li>
        <li>
          <a class="dropdown-item" href="food.html">Food</a>
        </li>
        <li>
          <a class="dropdown-item" href="energy.html">Energy</a>
        </li>
        <li>
          <a class="dropdown-item" href="recycling.html">Community</a>
        </li>
      </ul>
    </div>
  </li>`;

  navbarList.firstElementChild.insertAdjacentHTML(
    "afterend",
    categoriesBtnHtml
  );
}

export async function logOutUser() {
  const result = await Swal.fire({
    title: "Are you sure you want to log out?",
    text: "You will be logged out from your account.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log me out",
  });

  if (result.isConfirmed) {
    await signOut(firebaseAuth);

    window.location.href = "/";
  }
}

export async function navbarInit() {
  const user = await checkAuthState();
  if (!user) return;

  const userData = await getUserData(user);

  renderAuthenticatedNavBar(userData);
  // Add event listeners to new markup
  const logoutBtn = document.getElementById("logout");

  logoutBtn.addEventListener("click", logOutUser);
}

export function removeLoader() {
  const loader = document.getElementById("loader");
  loader.remove();
}
