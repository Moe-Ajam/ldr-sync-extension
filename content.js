var regStrip = /^[\r\t\f\v ]+|[\r\t\f\v ]+$/gm;

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
    logLevel: 6,
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
                // initializeWhenReady(document);
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
      //TODO: Fix the isVideoReady function to return correctly and consider a better flow to handle this situation
      const videoReadySatate = isVideoReady();
      if (videoReadySatate) {
        const videoPlayer =
          window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
        console.log(videoPlayer);
      }
    }
  } else {
    var children = [];
    if (node.children) {
      children = [...children, ...node.children];
    }
    for (const child of children) {
      checkForVideo(child, child.parentNode || parent, added);
    }
  }
}

// TODO: this is not working as expected, its not capturing hte netflix video element
function isVideoReady(document) {
  log("Begin initializeWhenReady", 5);
  // window.onload = () => {
  //   return true;
  // };
  if (document && location.hostname != "www.netflix.com") {
    if (document.readyState === "complete") {
      log("Running initializeNow...", 5);
      return true;
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === "complete") {
          log("Running initializeNow from else...", 5);
          return true;
        }
      };
    }
  } else if (document && location.hostname === "www.netflix.com") {
    log("You are on netflix");
    if (
      document.readyState === "complete" &&
      window.netflix &&
      window.netflix.appContext &&
      window.netflix.appContext.state &&
      window.netflix.appContext.state.playerApp &&
      typeof window.netflix.appContext.state.playerApp.getAPI === "function"
    ) {
      return true;
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === "complete") {
          log("Running initializeNow from netflix else...", 5);
          return true;
        }
      };
    }
  }

  log("End initializeWhenReady", 5);
}
