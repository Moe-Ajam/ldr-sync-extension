async function waitForVideoElement() {
  return new Promise((resolve) => {
    const video = document.querySelector("video");
    if (video) {
      resolve(video);
      return;
    }

    const observer = new MutationObserver((mutations, observerInstance) => {
      const video = document.querySelector("video");
      if (video) {
        observerInstance.disconnect();
        resolve(video);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback: Poll every 500ms in case MutationObserver doesn't catch it
    const fallbackInterval = setInterval(() => {
      const video = document.querySelector("video");
      if (video) {
        clearInterval(fallbackInterval);
        observer.disconnect();
        resolve(video);
      }
    }, 500);
  });
}

async function startMonitoringPlayback() {
  const video = await waitForVideoElement();
  console.log("Video element found:", video);

  setInterval(() => {
    const currentTime = video.currentTime;
    console.log("Current playback time:", currentTime);
    chrome.runtime.sendMessage({
      action: "update_time",
      current_time: currentTime,
    });
  }, 1000);
}

startMonitoringPlayback();
