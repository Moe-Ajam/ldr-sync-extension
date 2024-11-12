// TODO: make the code more readable and seperate it into files
API_URL = "http://127.0.0.1:8080";

let isConnected = false;

// helper function
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

document.addEventListener("DOMContentLoaded", async () => {
  // Elements
  const signInScreen = document.getElementById("signInScreen");
  const signUpScreen = document.getElementById("signUpScreen");
  const mainContent = document.getElementById("mainContent");

  const connectButton = document.getElementById("connectButton");
  const linkKey = document.getElementById("linkKey");

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
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);
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

  // Connecting
  connectButton.onclick = async () => {
    console.log("Connect button clicked!");
    // Requesting a new key from the server
    if (linkKey.value.trim() === "") {
      const response = await fetch(API_URL + "/api/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        linkKey.value = data.session_id;
        isConnected = true;
        updateButton();
      } else {
        alert("Something went wrong");
      }
    }
  };
});

// Elements
const personalKeyElement = document.getElementById("personalKey");
const friendKeyElement = document.getElementById("friendKey");

// Button elements
const linkButtonElement = document.getElementById("linkButton");

chrome.storage.local.get(["friendKey", "personalKey"], (result) => {
  const { friendKey, personalKey } = result;
  console.log("from the local storage");
  console.log("personal key from the storage:", personalKey);
  console.log("friend key from the storage:", friendKey);
});
