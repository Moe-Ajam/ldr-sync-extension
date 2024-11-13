let isConnected = false;

document.addEventListener("DOMContentLoaded", async () => {
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

  // Connecting
  connectButton.onclick = async () => {
    console.log("Connect button clicked!");
    const token = localStorage.getItem("auth_token");
    // Requesting a new key from the server
    if (linkKey.value.trim() === "") {
      const response = await fetch(API_URL + "/create-session", {
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

chrome.storage.local.get(["friendKey", "personalKey"], (result) => {
  const { friendKey, personalKey } = result;
  console.log("from the local storage");
  console.log("personal key from the storage:", personalKey);
  console.log("friend key from the storage:", friendKey);
});
