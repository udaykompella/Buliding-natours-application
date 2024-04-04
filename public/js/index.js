import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login } from "./login";
import { logout } from "/login";
import { updateSettings } from "./updateSettings";
import { signup } from "./signup";

// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const signupForm = document.querySelector(".form--signup");

// VALUES

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-user-data").textContent = "Updating ...";
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    updateSettings({ name, email }, "data");

    document.querySelector(".btn--save-user-data").textContent =
      "Save settings";
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating ...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value =
      document.getElementById("password").value =
      document.getElementById("password-confirm").value =
        "";
  });
}

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    debugger;
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("password-confirm").value;
    signup(name, email, password, confirmPassword);
  });
}
