import Swal from "sweetalert2";
import { firebaseAuth, firebaseDB } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { getUserData } from "./auth";
import { User } from "../classes/User";

const signUpModal = document.getElementById("signup");
const loginModal = document.getElementById("login");

const signupHtml = `
<input type="text" class="swal2-input" minlength="5" id="username" placeholder="Username" required />
<input type="email" id="email" class="swal2-input" placeholder="Email" required />
<input type="password" id="password" minlength="6" class="swal2-input" placeholder="Password" required  />
`;

const loginHtml = `
<input type="email" class="swal2-input" id="email" placeholder="Email" required />
<input type="password" id="password" class="swal2-input" placeholder="Password" required />
`;

console.log("fire");
// navbarInit();
// Initalise the auth navbar check

function signupForm() {
  Swal.fire({
    title: "Signup Form",
    icon: "question",
    html: signupHtml,
    confirmButtonText: "Sign Up",
    focusConfirm: false,
    didOpen: () => {
      const username = Swal.getPopup().querySelector("#username");
      const email = Swal.getPopup().querySelector("#email");
      const password = Swal.getPopup().querySelector("#password");

      username.addEventListener("focus", () => {
        username.classList.add("focused");
      });
      email.addEventListener("focus", () => {
        email.classList.add("focused");
      });
      password.addEventListener("focus", () => {
        password.classList.add("focused");
      });
    },
    preConfirm: () => {
      const username = Swal.getPopup().querySelector("#username").value.trim();
      const email = Swal.getPopup().querySelector("#email").value.trim();
      const password = Swal.getPopup().querySelector("#password").value;

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validate the email using the regular expression
      if (!emailPattern.test(email)) {
        Swal.showValidationMessage("Please enter a valid email address.");
      }

      if (password.length < 6) {
        Swal.showValidationMessage(
          `Please enter a password of least 6 characters.`
        );
      }
      if (username.length < 5) {
        Swal.showValidationMessage(
          `Please enter a username of least 5 characters.`
        );
      }

      if (!password) {
        Swal.showValidationMessage(`Please enter a password`);
      }
      if (!email) {
        Swal.showValidationMessage(`Please enter an email`);
      }
      if (!username) {
        Swal.showValidationMessage(`Please enter a username`);
      }

      return { email: email, password: password, username: username };
    },
  }).then(async (result) => {
    await signUpUserWithEmailAndPassword(
      result.value.username,
      result.value.email,
      result.value.password
    );
  });
}
function loginForm() {
  Swal.fire({
    title: "Login Form",
    icon: "question",
    html: loginHtml,
    confirmButtonText: "Sign in",
    focusConfirm: false,
    preConfirm: () => {
      const email = Swal.getPopup().querySelector("#email").value;
      const password = Swal.getPopup().querySelector("#password").value;
      if (!email || !password) {
        Swal.showValidationMessage(`Please enter login and password`);
      }
      return { email: email, password: password };
    },
  }).then(async (result) => {
    await signInUserWithEmailAndPassword(
      result.value.email,
      result.value.password
    );
  });
}

export async function signUpUserWithEmailAndPassword(
  username,
  email,
  password
) {
  try {
    const userCreds = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const { user } = userCreds;

    await Swal.fire({
      title: "Success!",
      text: `Welcome ${username}`,
      icon: "success",
      confirmButtonText: "Cool",
    });

    await createUserDocumentFromAuth(user, username);

    window.location.href = "dashboard.html";
  } catch (err) {
    console.log(err);
  }
}

export async function signInUserWithEmailAndPassword(email, password) {
  try {
    const { user } = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const userData = await getUserData(user);

    // Pop up fired on success
    await Swal.fire({
      title: "Success!",
      text: `Welcome back ${userData.name}`,
      icon: "success",
      confirmButtonText: "Cool",
    });

    // Awaits action before reloading page
    window.location.href = "dashboard.html";
  } catch (err) {
    Swal.fire({
      title: "Error!",
      text: "Invalid Credentials",
      icon: "error",
      confirmButtonText: "Cool",
    });
  }
}

async function createUserDocumentFromAuth(userAuth, userName) {
  if (!userAuth) return;

  const userDocument = await getUserDocument(userAuth);

  if (!userDocument) {
    const { email, displayName, uid } = userAuth;

    const createdAt = new Date();

    const data = {
      id: uid,
      createdAt,
      email,
      name: userName,
    };

    // create a new class
    const newUser = new User(data);

    // User object for firebase
    const userObject = {
      id: newUser.id,
      createdAt: newUser.createdAt,
      email: newUser.email,
      name: newUser.name,
      travel: newUser.travel,
      food: newUser.food,
      energy: newUser.energy,
      community: newUser.community,
    };

    try {
      const userDocRef = doc(firebaseDB, "users", userAuth.uid);
      await setDoc(userDocRef, userObject);
    } catch (err) {
      console.log(err);
    }
  }
}

async function getUserDocument(userAuth) {
  const userDocRef = doc(firebaseDB, "users", userAuth.uid);

  const userSnapShot = await getDoc(userDocRef);

  if (userSnapShot.exists()) {
    return userSnapShot.data();
  } else return null;
}

// anime({
//   targets: ".start-tracking",
//   translateY: [-1500, 0], // from 100 to 250
//   //   delay: 150,
//   duration: 1500,
//   direction: "normal",
//   easing: "easeOutBack",
// });

console.log(signUpModal);

signUpModal.addEventListener("click", signupForm);
loginModal.addEventListener("click", loginForm);
