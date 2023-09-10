import { checkAuthState, getUserData } from "./auth";

const routes = {
  404: "/pages/404.html",
  "/": "/pages/index.html",
  "/about": "/pages/about.html",
};

const rootDiv = document.getElementById("root");

const onNavigate = async (pathname, userData) => {
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
};

window.onpopstate = () => {
  onNavigate(window.location.pathname);
};

async function onLoad() {
  const route = routes[window.location.pathname] || routes[404];

  rootDiv.innerHTML = await fetch(route).then((data) => data.text());
}

onLoad();
window.onNavigate = onNavigate;
