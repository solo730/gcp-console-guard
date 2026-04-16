chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const panel = document.getElementById("gcp-console-guard-panel");
        if (panel) panel.remove();
        else {
          const script = document.createElement("script");
          script.src = chrome.runtime.getURL("content.js");
          document.head.appendChild(script);
        }
      },
    });
  }
});