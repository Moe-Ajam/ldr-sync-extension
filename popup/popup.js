API_URL = "http://127.0.0.1:8080";
document.addEventListener("DOMContentLoaded", async () => {
  const signInScreen = document.getElementById("signInScreen");
  const signUpScreen = document.getElementById("signUpScreen");
  const mainContent = document.getElementById("mainContent");

  const token = localStorage.getItem("auth_token");

  if (token) {
    console.log("Token exists");
    const isValid = await validateToken(token);
    if (isValid) {
      console.log("Token is valid");
      showMainContent();
    } else {
      console.log("Token is invalid");
      showSignIn();
    }
  } else {
    console.log("Token doesn't exist");
    showSignIn();
  }

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

  async function validateToken(token) {
    try {
      const response = await fetch(API_URL + "/api/validate-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
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

      const response = await fetch(API_URL + "/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      if (response.ok) {
        showSignIn();
      } else {
        alert("Sign up failed");
      }
    });

  // Form submission for Sign In
  document
    .getElementById("signInScreen")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signInEmail").value;
      const password = document.getElementById("signInPassword").value;

      const response = await fetch(API_URL + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("auth_token", data.token);
        showMainContent();
      } else {
        alert("Sign in failed");
      }
    });

  // Logout
  document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("auth_token");

    showSignIn();
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
