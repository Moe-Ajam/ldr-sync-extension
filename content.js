let video = null; // Track the current video element
let playbackInterval = null;

// Initialize video element
function initializeVideoElement(newVideo) {
  console.log("Initializing video element:", newVideo);

  // Remove listeners and interval from the old video element
  if (video) {
    video.removeEventListener("pause", handlePause);
    video.removeEventListener("play", handlePlay);
    clearInterval(playbackInterval);
  }

  video = newVideo;

  // Attach listeners to the new video element
  video.addEventListener("pause", handlePause);
  video.addEventListener("play", handlePlay);

  // Start sending playback updates
  playbackInterval = setInterval(() => {
    if (video) {
      chrome.runtime.sendMessage({
        action: "update_time",
        current_time: video.currentTime,
      });
    }
  }, 1000);
}

// Handle video events
function handlePause() {
  console.log("Video paused at:", video.currentTime);
  chrome.runtime.sendMessage({
    action: "pause",
    current_time: video.currentTime,
  });
}

function handlePlay() {
  console.log("Video playing at:", video.currentTime);
  chrome.runtime.sendMessage({
    action: "play",
    current_time: video.currentTime,
  });
}

// Monitor for video element changes
function monitorForVideoElement() {
  const observer = new MutationObserver(() => {
    const newVideo = document.querySelector("video");
    if (newVideo && newVideo !== video) {
      initializeVideoElement(newVideo); // Reinitialize if a new video element is found
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("Message received in content.js:", message);

  if (!video) {
    console.warn("Video element not ready. Waiting for initialization...");
    video = await waitForVideoElement();
  }

  if (message.action === "pause") {
    console.log("Pausing video...");
    video.pause();
  } else if (message.action === "play") {
    console.log("Playing video...");
    video.play();
  }
});

// Handle URL changes (e.g., navigating to a new episode)
let currentUrl = location.href;
setInterval(() => {
  if (location.href !== currentUrl) {
    console.log("URL changed. Reinitializing...");
    currentUrl = location.href;
    monitorForVideoElement(); // Reinitialize the video monitoring logic
  }
}, 1000);

// Start monitoring
monitorForVideoElement();
