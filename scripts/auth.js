// Form submission for Sign Up
document.getElementById("signUpForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;
  const username = document.getElementById("signUpUsername").value;

  const response = await fetch(API_URL + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });
  if (response.ok) {
    showSignIn();
  } else if (response.status === 409) {
    alert("email or username are already in use");
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

    const response = await fetch(API_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      chrome.storage.local.set({
        auth_token: data.token,
        username: data.name,
      });
      showMainContent();
    } else {
      alert("Sign in failed");
    }
  });

// Logout
document.getElementById("logoutButton").addEventListener("click", () => {
  // localStorage.removeItem("auth_token");
  chrome.storage.local.remove("auth_token");

  showSignIn();
});

async function validateToken(token) {
  try {
    const response = await fetch(API_URL + "/validate-token", {
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
