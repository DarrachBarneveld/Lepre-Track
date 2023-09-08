export function AuthNavBar(user) {
  const unAuthenticated = ` 
    <button
      class="nav-link btn btn-success text-white m-1 ms-0 mx-2 px-3"
      id="signup"
    >
      Signup <i class="fa-solid fa-user-plus"></i>
    </button>
    <button
      class="nav-link btn btn-success text-white m-1 ms-0 mx-2 px-3"
      id="login"
    >
      Login <i class="fa-solid fa-right-to-bracket"></i>
    </button>
  `;

  const authenticated = `
        <a
            class="nav-link btn btn-success text-white m-1 ms-0 mx-2 px-3 text-capitalize"
            href="dashboard.html"
            id="profile">
            <i class="fa-solid fa-user"></i>${user.name}
        </a>
        <button
            id="logout"
            class="nav-link btn btn-success text-white m-1 ms-0 mx-2 px-3">
            Log out <i class="fa-solid fa-right-to-bracket"></i>
        </button>
  `;

  html = user ? authenticated : unAuthenticated;
  return html;
}
