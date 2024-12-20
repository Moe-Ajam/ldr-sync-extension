// Elements
const signInScreen = document.getElementById("signInScreen");
const signUpScreen = document.getElementById("signUpScreen");
const mainContent = document.getElementById("mainContent");

const connectButton = document.getElementById("connectButton");
const linkKeyTextBox = document.getElementById("linkKey");

const personalKeyElement = document.getElementById("personalKey");
const friendKeyElement = document.getElementById("friendKey");

const showSignInButton = document.getElementById("showSignIn");
const showSignUpButton = document.getElementById("showSignUp");

const linkButtonElement = document.getElementById("linkButton");

const ButtonState = {
  REQUEST_SESSION: "REQUEST_SESSION",
  JOIN_SESSION: "JOIN_SESSION",
  CONNECT: "CONNECT",
  DISCONNECT: "DISCONNECT",
  DISABLED: "DISABLED",
  LOADIND: "LOADING",
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
    case ButtonState.REQUEST_SESSION:
      connectButton.textContent = "Request Session";
      connectButton.classList.remove("is-success");
      connectButton.classList.remove("is-danger");
      connectButton.classList.add("is-link");
      connectButton.classList.add("is-outlined");
      connectButton.classList.remove("is-info");
      connectButton.classList.remove("warning");
      connectButton.classList.remove("is-loading");
      connectButton.disabled = false;
      break;
    case ButtonState.JOIN_SESSION:
      connectButton.textContent = "Join Session";
      connectButton.classList.remove("is-success");
      connectButton.classList.remove("is-danger");
      connectButton.classList.remove("is-link");
      connectButton.classList.remove("is-outlined");
      connectButton.classList.add("is-info");
      connectButton.classList.remove("warning");
      connectButton.classList.remove("is-loading");
      connectButton.disabled = false;
      break;
    case ButtonState.CONNECT:
      connectButton.textContent = "Connect";
      connectButton.classList.add("is-success");
      connectButton.classList.remove("is-danger");
      connectButton.classList.remove("is-link");
      connectButton.classList.remove("is-outlined");
      connectButton.classList.remove("is-info");
      connectButton.classList.remove("warning");
      connectButton.classList.remove("is-loading");
      connectButton.disabled = false;
      break;
    case ButtonState.DISCONNECT:
      connectButton.textContent = "Disconnect";
      connectButton.classList.remove("is-success");
      connectButton.classList.add("is-danger");
      connectButton.classList.remove("is-link");
      connectButton.classList.remove("is-outlined");
      connectButton.classList.remove("is-info");
      connectButton.classList.remove("warning");
      connectButton.classList.remove("is-loading");
      connectButton.disabled = false;
      break;
    case ButtonState.LOADIND:
      connectButton.textContent = "Loading";
      connectButton.classList.remove("is-success");
      connectButton.classList.remove("is-danger");
      connectButton.classList.remove("is-link");
      connectButton.classList.remove("is-outlined");
      connectButton.classList.remove("is-info");
      connectButton.classList.add("warning");
      connectButton.classList.add("is-loading");
      connectButton.disabled = false;
      break;
    case ButtonState.DISABLED:
      connectButton.disabled = true;
      break;
    default:
      connectButton.textContent = "Request Session";
      connectButton.classList.remove("is-success");
      connectButton.classList.remove("is-danger");
      connectButton.classList.add("is-link");
      connectButton.classList.add("is-outlined");
      connectButton.classList.remove("is-info");
      connectButton.classList.remove("warning");
      connectButton.classList.remove("is-loading");
      connectButton.disabled = false;
      break;
  }
}
