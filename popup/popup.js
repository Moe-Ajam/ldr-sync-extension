let isConnected = false;

document.addEventListener("DOMContentLoaded", async () => {
  let currentButtonState = ButtonState.REQUEST_SESSION;
  updateButton(currentButtonState);

  // Retrieve the token from chrome.storage.local
  chrome.storage.local.get(["auth_token"], async (result) => {
    const token = result.auth_token; // Retrieve the token from storage

    if (token) {
      console.log("Token received:", token);

      // Validate the token
      const isValid = await validateToken(token);
      if (isValid) {
        console.log("Token is valid");
        showMainContent();
      } else {
        console.log("Token is invalid");
        showSignIn();
      }
    } else {
      console.error("Token not found in chrome storage");
      showSignIn();
    }
  });

  // Connecting button logic
  connectButton.onclick = async () => {
    if (connectButton.textContent === "Request Session") {
      console.log("Requesting connection...");
      await createSession();
      updateButton(ButtonState.DISCONNECT);
    } else if (connectButton.textContent === "Disconnect") {
      console.log("Disconnecting session...");
      await disconnectSession();
      updateButton(ButtonState.REQUEST_SESSION);
      linkKeyTextBox.value = "";
    }
  };
});
