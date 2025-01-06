//TODO: use the new logic with the connection button
// const API_URL = "http://82.112.255.162:8080/api";
const API_URL = "https://api.moecodes.com/api";

async function disconnectSession() {
  chrome.runtime.sendMessage(
    {
      type: "disonnect_websocket",
    },
    (response) => {
      if (response.status === "disconnected") {
        console.log("WebSocket disconnected successfully");
        chrome.storage.local.set({
          connection_status: "initial",
          session_id: "",
        });
      }
    },
  );
}

async function createSession() {
  chrome.storage.local.get(["auth_token"], async (result) => {
    const token = result.auth_token;

    if (!token) {
      console.error("Authorization token missing");
      return;
    }
    try {
      const response = await fetch(API_URL + "/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sessionID = data.session_id;
        linkKeyTextBox.value = sessionID;

        chrome.runtime.sendMessage(
          {
            type: "connect_websocket",
            sessionID: sessionID,
          },
          (response) => {
            if (response.status === "connected") {
              console.log("WebSocket connected through background.js");

              chrome.storage.local.set({
                connection_status: "connected",
                session_id: sessionID,
              });
            }
          },
        );
      } else {
        alert("Failed to create a session.");
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  });
}

async function joinSession(sessionID) {
  chrome.storage.local.get(["auth_token", "username"], async (result) => {
    const token = result.auth_token;
    const username = result.username;

    if (!token) {
      console.error("Authorization token missing");
      return;
    }
    try {
      const response = await fetch(API_URL + "/join-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionID, request_user: username }),
      });

      if (response.ok) {
        const data = await response.json();
        const sessionID = data.session_id;

        chrome.runtime.sendMessage(
          {
            type: "connect_websocket",
            sessionID: sessionID,
          },
          (response) => {
            if (response.status === "connected") {
              console.log("WebSocket connected through background.js");

              chrome.storage.local.set({
                connection_status: "connected",
                session_id: sessionID,
              });
            }
          },
        );
      } else {
        alert("Failed to create a session.");
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  });
}
