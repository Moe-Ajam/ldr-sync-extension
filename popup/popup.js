// Elements
const personalKeyElement = document.getElementById("personalKey");
const friendKeyElement = document.getElementById("friendKey");

// Button elements
const linkButtonElement = document.getElementById("linkButton");

linkButtonElement.onclick = () => {
  const prefs = {
    friendKey: friendKeyElement.value,
    personalKey: personalKeyElement.value,
  };
  chrome.runtime.sendMessage({ event: "onStart", prefs });
  friendKeyElement.value = "TEST-VALUE";
};

chrome.storage.local.get(["friendKey", "personalKey"], (result) => {
  const { friendKey, personalKey } = result;
  console.log("from the local storage");
  console.log("personal key from the storage:", personalKey);
  console.log("friend key from the storage:", friendKey);
});
