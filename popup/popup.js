// Elements
const personalKeyElement = document.getElementById("personalKey");
const friendKeyElement = document.getElementById("friendKey");

// Button elements
const linkButtonElement = document.getElementById("linkButton");

linkButtonElement.onclick = function () {
  friendKeyElement.value = "TEST-VALUE";
};
