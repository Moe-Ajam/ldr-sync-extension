chrome.runtime.onInstalled.addListener((details) => {
  console.log("onInstalled reason:", details.reason);
});

chrome.runtime.onMessage.addListener((data) => {
  switch (data.event) {
    case "onStop":
      console.log("On stop in background");
      break;
    case "onStart":
      handleOnStart(data.prefs);
      break;
    default:
      break;
  }
});

const handleOnStart = (prefs) => {
  console.log("On start in background");
  console.log(prefs);
  chrome.storage.local.set(prefs);
};
