// const WS_URL = "ws://82.112.255.162:8080/api";
const WS_URL = "wss://api.moecodes.com/api";

let socket = null;
let sessionID = null;

chrome.storage.local.set({
  connection_status: "initial",
  session_id: "",
});

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
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const activeTabId = tabs[0].id;
          chrome.tabs.sendMessage(activeTabId, {
            action: message.action,
            time: message.current_time,
          });
        }
      });
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
  chrome.storage.local.get(["username"], (result) => {
    if (
      message.action === "update_time" &&
      socket &&
      socket.readyState === WebSocket.OPEN
    ) {
      sendMessage("update_time", message.current_time, result.username);
    } else if (
      message.action === "pause" &&
      socket &&
      socket.readyState === WebSocket.OPEN
    ) {
      sendMessage("pause", message.current_time, result.username);
    } else if (
      message.action === "play" &&
      socket &&
      socket.readyState === WebSocket.OPEN
    ) {
      sendMessage("play", message.current_time, result.username);
    } else if (message.type === "connect_websocket") {
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

  return true;
});

function sendMessage(action, current_time, username) {
  const playbackMessage = {
    action: action,
    current_time: current_time,
    user_id: username,
  };
  console.log(playbackMessage);
  socket.send(JSON.stringify(playbackMessage));
}
