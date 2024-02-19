import "@babel/polyfill";
import { login } from "./login";
import { displayMap } from "./mapbox";

const locations = JSON.parse(document.getElementById("map").dataset.locations);

displayMap(locations);
document.querySelector(".form").addEventListener("submit", (e) => {
  debugger;
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});
