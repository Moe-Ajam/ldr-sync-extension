const WS_URL = "ws://127.0.0.1:8080/api";

let socket = null;
let sessionID = null;

function connectWebSocket(newSessionID) {
  chrome.storage.local.get(["auth_token"], (result) => {
    const token = result.auth_token;

    if (!token) {
      console.error("Authorization token missing");
      return;
    }
    sessionID = newSessionID;
    const wsURL = `${WS_URL}/ws?session_id=${sessionID}&token=${token}`;
    socket = new WebSocket(wsURL);
    console.log("Establishing connection...");

    socket.onopen = () => {
      console.log("WebSocket connection established for session:", sessionID);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Recieved message:", message);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed for session:", sessionID);
    };
  });
}

function disconnectWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
    sessionID = null;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "connect_websocket") {
    console.log("message recieved:", message);
    connectWebSocket(message.sessionID);
    sendResponse({ status: "connected" });
  } else if (message.type === "disonnect_websocket") {
    disconnectWebSocket();
    sendResponse({ status: "disconnected" });
  } else {
    sendResponse({ status: "error", error: "WebSocket not connected" });
  }
});
