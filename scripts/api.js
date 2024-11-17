//TODO: use the new logic with the connection button
const API_URL = "http://127.0.0.1:8080/api";
const WS_URL = "ws://127.0.0.1:8080/api";

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

      connectWebSocket(sessionID);
      console.log("Connection established!");
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

function connectWebSocket(sessionID) {
  const wsURL = `ws:${WS_URL}/ws?session_id={sessionID}`;
  const socket = new WebSocket(wsURL);
  console.log("Establishing connection...");
  console.log(`ws:${WS_URL}/ws?session_id={sessionID}`);

  socket.onopen = () => {
    console.log("WebSocket connection established for session:", sessionID);
    updateButton(ButtonState.DISCONNECT);
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("Recieved message:", message);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed for session:", sessionID);
    updateButton(ButtonState.REQUEST_SESSION);
  };
}
