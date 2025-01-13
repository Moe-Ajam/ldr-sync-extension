var regStrip = /^[\r\t\f\v ]+|[\r\t\f\v ]+$/gm;
let video = null;
let playbackInterval = null;

var tc = {
  settings: {
    enabled: true,

    blacklist: `\
    www.crunchyroll.com
    twitter.com
    imgur.com
    teams.microsoft.com
    `.replace(regStrip, ""),
    defaultLogLevel: 4,
    logLevel: 2,
  },

  mediaElements: [],
};

log("Script starting...", 5);

function log(message, level) {
  verbosity = tc.settings.logLevel;
  if (typeof level === "undefined") {
    level = tc.settings.defaultLogLevel;
  }
  if (verbosity >= level) {
    if (level === 2) {
      console.log("ERROR:" + message);
    } else if (level === 3) {
      console.log("WARNING:" + message);
    } else if (level === 4) {
      console.log("INFO:" + message);
    } else if (level === 5) {
      console.log("DEBUG:" + message);
    } else if (level === 6) {
      console.log("DEBUG (VERBOSE):" + message);
      // outputs a static trace to the console, can also output the sequence of events that led to this point
      console.trace();
    }
  }
}

function initializeVideoElement(newVideo) {
  log("Initializing video element", 5);

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
      safeSendMessage({
        action: "update_time",
        current_time: video.currentTime,
      });
    }
  }, 3000);
}

// Handle video events
function handlePause() {
  log("Video paused at:" + video.currentTime, 5);
  safeSendMessage({
    action: "pause",
    current_time: video.currentTime,
  });
}

function handlePlay() {
  log("Video playing at:" + video.currentTime, 5);
  safeSendMessage({
    action: "play",
    current_time: video.currentTime,
  });
}

function safeSendMessage(message) {
  try {
    chrome.runtime.sendMessage(message);
  } catch (error) {
    if (error.message.includes("Extension context invalidated")) {
      log("Extension context invalidated. Message not sent.", 3);
    } else {
      log("Error sending message: " + error.message, 2);
    }
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(
  async (message, _sender, _sendResponse) => {
    log("Message received in content.js:" + message, 5);

    if (message.action === "pause") {
      log("Pausing video...", 5);
      video.pause();
    } else if (message.action === "play") {
      log("Playing video...", 5);
      video.play();
    }
  },
);

var documentAndShadowRootObserver = new MutationObserver(function (mutations) {
  // Process the DOM nodes lazily without affecting the page critical events
  requestIdleCallback(
    (_) => {
      mutations.forEach(function (mutation) {
        switch (mutation.type) {
          case "childList":
            mutation.addedNodes.forEach(function (node) {
              if (typeof node === "function") return;
              if (node === document.documentElement) {
                log("Document was replaced, reinitializing", 5);
                return;
              }
              checkForVideo(node, node.parentNode || mutation.target, true);
            });
            break;
        }
      });
    },
    { timeout: 1000 },
  );
});

var documentAndShadowRootObserverOptions = {
  attributeFilter: ["aria-hidden", "data-focus-method"],
  childList: true,
  subtree: true,
};

documentAndShadowRootObserver.observe(
  document,
  documentAndShadowRootObserverOptions,
);

function checkForVideo(node, parent, added) {
  if (!added && document.body?.contains(node)) {
    return;
  }
  if (node.nodeName === "VIDEO") {
    if (added) {
      log("Video element added", 5);
      initializeVideoElement(node);
    }
  } else {
    var children = [];
    if (node.shadowRoot) {
      documentAndShadowRootObserver.observe(
        node.shadowRoot,
        documentAndShadowRootObserverOptions,
      );
      children = Array.from(node.shadowRoot.children);
    }
    if (node.children) {
      children = [...children, ...node.children];
    }
    for (const child of children) {
      checkForVideo(child, child.parentNode || parent, added);
    }
  }
}

function initializeNow() {
  log("Begin initializeNow", 5);
}
