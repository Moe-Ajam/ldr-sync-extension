let isConnected = false;

document.addEventListener("DOMContentLoaded", async () => {
  chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "knockknock");
    post.onMessage.addListener(function (msg) {
      if (msg.joke === "Knock knock")
        port.postMessage({ question: "Who's there?" });
      else if (msg.answer === "Madame")
        port.postMessage({ question: "Madame who?" });
      else if (msg.answer === "Madame... Bovary")
        port.postMessage({ question: "I don't get it." });
    });
  });
  const token = localStorage.getItem("auth_token");
  let currentButtonState = ButtonState.REQUEST_SESSION;
  updateButton(currentButtonState);

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
    // const token = localStorage.getItem("auth_token");
    //// Requesting a new key from the server
    // if (linkKeyTextBox.value.trim() === "") {
    //   const response = await fetch(API_URL + "/create-session", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   if (response.ok) {
    //     const data = await response.json();
    //     linkKeyTextBox.value = data.session_id;
    //     currentButtonState = ButtonState.CONNECT;
    //     updateButton(currentButtonState);
    //   } else {
    //     alert("Something went wrong");
    //   }
    // }
    if (connectButton.textContent === "Request Session") {
      console.log("Requesting connection...");
      await createSession();
      updateButton(ButtonState.DISCONNECT);
    } else if (connectButton.textContent === "Disconnect") {
      console.log("Requesting connection...");
      await disconnectSession();
      updateButton(ButtonState.CONNECT);
      linkKeyTextBox.value = "";
    }
  };
});
