import Swal from "sweetalert2";
import { firebaseAuth, firebaseDB } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "@firebase/firestore";

const signUpModal = document.getElementById("signup");

const signupHtml = `
<input type="text" class="swal2-input" minlength="5" id="username" placeholder="Username" required />
<input type="email" id="email" class="swal2-input" placeholder="Email" required />
<input type="password" id="password" minlength="6" class="swal2-input" placeholder="Password" required  />
`;

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

signUpModal.addEventListener("click", signupForm);

async function signUpUserWithEmailAndPassword(username, email, password) {
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

    createUserDocumentFromAuth(user, username);

    window.location.href = "dashboard.html";
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

async function getUserDocument(userAuth) {
  const userDocRef = doc(firebaseDB, "users", userAuth.uid);

  const userSnapShot = await getDoc(userDocRef);

  if (userSnapShot.exists()) {
    return userSnapShot.data();
  } else return null;
}
