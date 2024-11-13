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

const ButtonState = {
  GET_SESSION: "GET_SESSION",
  CONNECT: "CONNECT",
  DISCONNECT: "DISCONNECT",
};

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

function updateButton(currentButtonState) {
  switch (currentButtonState) {
    case ButtonState.GET_SESSION:
      connectButton.textContent = "New Session";
      connectButton.classList.remove("is-success");
      connectButton.classList.remove("is-danger");
      connectButton.classList.add("is-warning");
      break;
    case ButtonState.CONNECT:
      connectButton.textContent = "Connect";
      connectButton.classList.add("is-success");
      connectButton.classList.remove("is-danger");
      connectButton.classList.remove("is-warning");
      break;
    case ButtonState.DISCONNECT:
      connectButton.textContent = "Disconnect";
      connectButton.classList.remove("is-success");
      connectButton.classList.add("is-danger");
      connectButton.classList.remove("is-warning");
      break;
    default:
      connectButton.textContent = "New Session";
      connectButton.classList.remove("is-success");
      connectButton.classList.remove("is-danger");
      connectButton.classList.add("is-warning");
      break;
  }
}
