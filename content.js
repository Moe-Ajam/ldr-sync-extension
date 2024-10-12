function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

sleep(4000).then(() => {
  const video = document.querySelector("video");

  if (video) {
    console.log("Current time", video.currentTime);
  } else {
    console.log("No video element found on this page!");
  }
  console.log("waiting 2 seconds...");
  sleep(2000).then(() => {
    video.pause();
    console.log("Video Paused!");
    console.log("Video time at pausing:", video.currentTime);
    sleep(2000).then(() => {
      console.log("Taking the video back 10 seconds...");
      video.currentTime = 10;
      console.log("Video time after going back", video.currentTime);
    });
  });
});
