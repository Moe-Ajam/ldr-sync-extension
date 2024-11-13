// Elements
const signInScreen = document.getElementById("signInScreen");
const signUpScreen = document.getElementById("signUpScreen");
const mainContent = document.getElementById("mainContent");

const connectButton = document.getElementById("connectButton");
const linkKey = document.getElementById("linkKey");

const personalKeyElement = document.getElementById("personalKey");
const friendKeyElement = document.getElementById("friendKey");

const showSignInButton = document.getElementById("showSignIn");
const showSignUpButton = document.getElementById("showSignUp");

const linkButtonElement = document.getElementById("linkButton");

showSignUpButton.addEventListener("click", showSignUp);
showSignInButton.addEventListener("click", showSignIn);

function showSignIn() {
  signInScreen.style.display = "block";
  signUpScreen.style.display = "none";
  mainContent.style.display = "none";
}
function showSignUp() {
  signInScreen.style.display = "none";
  signUpScreen.style.display = "block";
  mainContent.style.display = "none";
}
function showMainContent() {
  signInScreen.style.display = "none";
  signUpScreen.style.display = "none";
  mainContent.style.display = "block";
}

function updateButton() {
  if (isConnected) {
    connectButton.textContent = "Disconnect";
    connectButton.classList.remove("is-success");
    connectButton.classList.add("is-danger");
  } else {
    connectButton.textContent = "Connect";
    connectButton.classList.remove("is-danger");
    connectButton.classList.add("is-success");
  }
}
