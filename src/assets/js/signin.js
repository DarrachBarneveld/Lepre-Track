import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

import { firebaseAuth, firebaseDB } from "../../config/firebase";
import { delayTimer } from "../../helpers/helpers";
import { getUserData } from "./auth";

const signupForm = document.getElementById("signup");
const loginForm = document.getElementById("login");

const userNameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");

async function signUpUserWithEmailAndPassword(e) {
  e.preventDefault();

  const signUpEmail = emailInput.value;
  const signUpPassword = passwordInput.value;
  const userName = userNameInput.value;

  try {
    const userCreds = await createUserWithEmailAndPassword(
      firebaseAuth,
      signUpEmail,
      signUpPassword
    );

    const { user } = userCreds;

    await Swal.fire({
      title: "Success!",
      text: `Welcome ${userName}`,
      icon: "success",
      confirmButtonText: "Cool",
    });

    createUserDocumentFromAuth(user, userName);

    window.location.href = "home.html";
  } catch (err) {
    console.log(err);
  }
}

async function createUserDocumentFromAuth(userAuth, userName) {
  if (!userAuth) return;

  const userDocument = await getUserDocument(userAuth);

  if (!userDocument) {
    const { email, displayName, uid } = userAuth;

    const createAt = new Date();

    const newUser = {
      id: uid,
      createAt,
      email,
      name: userName,
    };

    try {
      const userDocRef = doc(firebaseDB, "users", userAuth.uid);
      await setDoc(userDocRef, newUser);
    } catch (err) {
      console.log(err);
    }
  }
}

async function signInUserWithEmailAndPassword(e) {
  e.preventDefault();

  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

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
    window.location.href = "home.html";
  } catch (err) {
    console.log(err);
    // loginMessage.innerText = "Invalid Credentials";

    // await delayTimer(2);
    // loginMessage.innerText = "";
    Swal.fire({
      title: "Error!",
      text: "Invalid Credentials",
      icon: "error",
      confirmButtonText: "Cool",
    });
  }
}

async function getUserDocument(userAuth) {
  const userDocRef = doc(firebaseDB, "users", userAuth.uid);

  const userSnapShot = await getDoc(userDocRef);

  if (userSnapShot.exists()) {
    return userSnapShot.data();
  } else return null;
}

signupForm.addEventListener("submit", signUpUserWithEmailAndPassword);
loginForm.addEventListener("submit", signInUserWithEmailAndPassword);

emailInput.addEventListener("focus", () => {
  emailInput.classList.add("focused");
});

userNameInput.addEventListener("focus", () => {
  userNameInput.classList.add("focused");
});

passwordInput.addEventListener("focus", () => {
  passwordInput.classList.add("focused");
});

loginEmailInput.addEventListener("focus", () => {
  loginEmailInput.classList.add("focused");
});

loginPasswordInput.addEventListener("focus", () => {
  loginPasswordInput.classList.add("focused");
});
