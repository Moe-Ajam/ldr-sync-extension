console.log("content script loaded");

let lastRun = 0;
function throttleHandleVideo() {
  const now = Date.now();
  if (now - lastRun >= 300) {
    handleVideo();
    lastRun = now;
  }
}
function handleVideo() {
  const video = document.querySelector("video");

  if (video) {
    console.log("Current time", video.currentTime);
  }
}

const observer = new MutationObserver((mutation) => {
  throttleHandleVideo();
});

observer.observe(document.body, { childList: true, subtree: true });

handleVideo();
