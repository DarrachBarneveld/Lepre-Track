import Swal from "sweetalert2";
import { getUserData, checkAuthState } from "./auth";

document.addEventListener("DOMContentLoaded", async function () {
  const user = await checkAuthState();
  const userData = await getUserData(user);

  Swal.fire({
    title: "Success!",
    text: `Welcome back ${userData.name}`,
    icon: "success",
    confirmButtonText: "Cool",
  });
});
