import Swal from "sweetalert2";
import {
  signUpUserWithEmailAndPassword,
  signInUserWithEmailAndPassword,
} from "./index";

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

signUpModal.addEventListener("click", signupForm);
loginModal.addEventListener("click", loginForm);

let chatBtn = document.querySelector(".chat-btn");

chatBtn.addEventListener("click", () => {
  let chatDiv = document.querySelector(".chat-div");
  chatDiv.classList.toggle("active");
});
