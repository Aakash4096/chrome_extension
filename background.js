// Listen for when a tab changes ( typing a new URL)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only check when the page is fully loading and has a URL
  if (changeInfo.status === "loading" && tab.url) {
    // This prevents an infinite loop since we redirect blocked pages to Google.
    if (tab.url.includes("google.com")) return;
    // Get the list of blocked sites and the ON/OFF status
    chrome.storage.local.get(["blockedSites", "isEnabled"], (data) => {
      // If the extension is turned ON
      if (data.isEnabled) {
        const sites = data.blockedSites || [];
        const isBlocked = sites.some((site) => {
          // This ensures we never block the search engine even if it's in the list.
          if (site.toLowerCase().includes("google")) {
            return false;
          }

          // Otherwise, check if the URL matches the blocked site
          return tab.url.includes(site);
        });

        if (isBlocked) {
          // Redirect the user to a blank page or google
          chrome.tabs.update(tabId, { url: "https://www.google.com" });
        }
      }
    });
  }
});
