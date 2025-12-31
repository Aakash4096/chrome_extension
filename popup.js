// Get our buttons and inputs from the HTML
const toggleBtn = document.getElementById("toggleBtn");
const addBtn = document.getElementById("addBtn");
const siteInput = document.getElementById("siteInput");
const siteList = document.getElementById("siteList");

// 1. Initialize: Check storage when popup opens
chrome.storage.local.get(["blockedSites", "isEnabled"], (data) => {
  const sites = data.blockedSites || [];
  const enabled = data.isEnabled || false;

  renderSites(sites);
  updateToggleButton(enabled);
});

// 2. Logic for the ON/OFF button
toggleBtn.onclick = () => {
  chrome.storage.local.get(["isEnabled"], (data) => {
    const newState = !data.isEnabled;
    chrome.storage.local.set({ isEnabled: newState }, () => {
      updateToggleButton(newState);
    });
  });
};

function updateToggleButton(isEnabled) {
  toggleBtn.innerText = isEnabled ? "Turn OFF " : "Turn ON ";
  toggleBtn.style.backgroundColor = isEnabled ? "#dc3545" : "#28a745";
}

// 3. Logic for adding a website
addBtn.onclick = () => {
  const website = siteInput.value.trim();
  if (website) {
    chrome.storage.local.get(["blockedSites"], (data) => {
      const currentSites = data.blockedSites || [];
      // Avoid adding duplicates
      if (!currentSites.includes(website)) {
        const newList = [...currentSites, website];
        chrome.storage.local.set({ blockedSites: newList }, () => {
          siteInput.value = "";
          renderSites(newList);
        });
      }
    });
  }
};

// 4. NEW: Logic for removing a website
function removeSite(siteToRemove) {
  chrome.storage.local.get(["blockedSites"], (data) => {
    const currentSites = data.blockedSites || [];
    // Filter out the site we want to remove
    const newList = currentSites.filter((site) => site !== siteToRemove);

    chrome.storage.local.set({ blockedSites: newList }, () => {
      renderSites(newList);
    });
  });
}

// Helper function to show the list with Delete buttons
function renderSites(sites) {
  siteList.innerHTML = ""; // Clear current list

  sites.forEach((site) => {
    // Create the container for the row
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.marginBottom = "5px";
    div.style.borderBottom = "1px solid #eee";
    div.style.padding = "5px 0";

    // Create the text
    const text = document.createElement("span");
    text.innerText = "RESTRICTED : " + site;

    // Create the Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "remove";

    // Styling the delete button specifically to look small
    deleteBtn.style.background = "none";
    deleteBtn.style.border = "none";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.padding = "0 5px";
    deleteBtn.style.fontSize = "12px";
    deleteBtn.style.color = "red";
    deleteBtn.style.width = "auto"; // Prevent it from stretching

    // When clicked, remove this specific site
    deleteBtn.onclick = () => {
      removeSite(site);
    };

    // Add text and button to the row
    div.appendChild(text);
    div.appendChild(deleteBtn);
    siteList.appendChild(div);
  });
}
