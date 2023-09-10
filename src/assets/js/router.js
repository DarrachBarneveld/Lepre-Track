import { checkAuthState, getUserData } from "./auth";

const routes = {
  404: "/pages/404.html",
  "/": "/pages/index.html",
  "/about": "/pages/about.html",
  "/learn": "/pages/learn.html",
};

const rootDiv = document.getElementById("root");

const onNavigate = async (pathname) => {
  let userData = window.history.state?.userData;
  if (!userData) {
    const user = await checkAuthState();

    if (user) {
      userData = await getUserData(user);
    }
  }

  window.history.pushState(
    { userData },
    pathname,
    window.location.origin + pathname
  );

  const route = routes[pathname] || routes[404];
  const html = await fetch(route).then((data) => data.text());

  rootDiv.innerHTML = html;

  $("#carouselExampleSlidesOnly").carousel();
};

window.onpopstate = () => {
  onNavigate(window.location.pathname);
};

onNavigate(window.location.pathname);
window.onNavigate = onNavigate;
