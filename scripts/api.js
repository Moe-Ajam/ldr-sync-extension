//TODO: use the new logic with the connection button
const API_URL = "http://127.0.0.1:8080/api";

async function disconnectSession() {
  chrome.runtime.sendMessage(
    {
      type: "disconnect_websocket",
    },
    (response) => {
      if (response.status === "disconnected") {
        console.log("WebSocket disconnected successfully");
      }
    },
  );
}

async function createSession() {
  const token = localStorage.getItem("auth_token");
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
          }
        },
      );
    } else {
      alert("Failed to create a session.");
    }
  } catch (error) {
    console.error("Error creating session:", error);
  }
}

async function joinSession() {
  const token = localStorage.getItem("auth_token");
  const sessionID = linkKeyTextBox.value;

  if (!sessionID) {
    alert("Please enter a session ID to join.");
    return;
  }

  try {
    const response = await fetch(API_URL + "/join-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ session_id: sessionID }),
    });

    if (response.ok) {
      connectWebSocket(sessionID);
    } else {
      alert("Failed to create a session.");
    }
  } catch (error) {
    console.error("Error creating session:", error);
  }
}
