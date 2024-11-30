let isConnected = false;

document.addEventListener("DOMContentLoaded", async () => {
  let currentButtonState = ButtonState.REQUEST_SESSION;
  updateButton(currentButtonState);

  // Retrieve the token from chrome.storage.local
  chrome.storage.local.get(
    ["auth_token", "connection_status", "session_id"],
    async (result) => {
      const token = result.auth_token;

      if (token) {
        console.log("Token received:", token);

        const isValid = await validateToken(token);
        if (isValid) {
          console.log("Token is valid");
          updateButton(ButtonState.REQUEST_SESSION);
          showMainContent();
        } else {
          console.log("Token is invalid");
          showSignIn();
        }
      } else {
        console.error("Token not found in chrome storage");
        showSignIn();
      }

      if (result.connection_status === "connected") {
        updateButton(ButtonState.DISCONNECT);
        linkKeyTextBox.value = result.session_id;
      } else if (result.connection_status === "initial") {
        updateButton(ButtonState.REQUEST_SESSION);
        linkKeyTextBox.value = "";
      }
      linkKeyTextBox.addEventListener("input", handleInputChange);

      function handleInputChange(event) {
        const inputText = event.target.value;
        if (
          inputText.length === 36 &&
          connectButton.textContent === "Request Session"
        ) {
          console.log("should be join session now");
          updateButton(ButtonState.JOIN_SESSION);
        } else {
          console.log("useless trigger");
          updateButton(ButtonState.REQUEST_SESSION);
        }
      }

      // Connecting button logic
      connectButton.onclick = async () => {
        if (connectButton.textContent === "Request Session") {
          updateButton(ButtonState.LOADIND);
          await createSession();
          updateButton(ButtonState.DISCONNECT);
        } else if (connectButton.textContent === "Disconnect") {
          updateButton(ButtonState.LOADIND);
          await disconnectSession();
          updateButton(ButtonState.REQUEST_SESSION);
          linkKeyTextBox.value = "";
        } else if (connectButton.textContent === "Join Session") {
          await joinSession(linkKeyTextBox.value);
          updateButton(ButtonState.DISCONNECT);
        }
      };
    },
  );
});
