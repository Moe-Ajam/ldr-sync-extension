API_URL = "127.0.0.1:8080/api";
document.addEventListener("DOMContentLoaded", () => {
  const signInScreen = document.getElementById("signInScreen");
  const signUpScreen = document.getElementById("signUpScreen");
  const mainContent = document.getElementById("mainContent");

  showSignIn();

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

  document.getElementById("showSignUp").addEventListener("click", showSignUp);
  document.getElementById("showSignIn").addEventListener("click", showSignIn);

  // Form submission for Sign Up
  document
    .getElementById("signUpForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signUpEmail").value;
      const password = document.getElementById("signUpPassword").value;
      const username = document.getElementById("signUpUsername").value;

      const response = await fetch("http://127.0.0.1:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      if (response.ok) {
        showMainContent();
      } else {
        alert("Sign up failed");
      }
    });
});
// Elements
const personalKeyElement = document.getElementById("personalKey");
const friendKeyElement = document.getElementById("friendKey");

// Button elements
const linkButtonElement = document.getElementById("linkButton");

linkButtonElement.onclick = () => {
  const prefs = {
    friendKey: friendKeyElement.value,
    personalKey: personalKeyElement.value,
  };
  chrome.runtime.sendMessage({ event: "onStart", prefs });
  friendKeyElement.value = "TEST-VALUE";
};

chrome.storage.local.get(["friendKey", "personalKey"], (result) => {
  const { friendKey, personalKey } = result;
  console.log("from the local storage");
  console.log("personal key from the storage:", personalKey);
  console.log("friend key from the storage:", friendKey);
});
