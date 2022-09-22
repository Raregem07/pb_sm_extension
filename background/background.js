let search_rows = [];
let processed_rows = 0;
let csvContent = "";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({processed_rows});
    //console.log("processed_rows is set to " + processed_rows);
});

/* chrome.action.onClicked.addListener( async () => {

    console.log("action button clicked");
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes("https://app.profilebuddy.io/smdashboard") 
        || tab.url.includes("localhost:3000/smdashboard") || tab.url.includes("https://www.google.com/search?q")) {
        await chrome.action.setPopup({popup: "popup/popup.html"});
        await chrome.storage.local.set({popup_err: "allowed"});
    } else {
        console.log("can not be. borrow one from two.");
        await chrome.action.setPopup({popup: "popup/popup.html"});
        await chrome.storage.local.set({popup_err: "not_allowed"});
    }
}) */

chrome.tabs.onActivated.addListener((activeInfo) => {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url.includes("https://app.profilebuddy.io/smdashboard") || tab.url.includes("localhost:3000/smdashboard")) {
        //if (tab.url.includes("localhost:3000/smdashboard")) {
            //console.log("onActivated->" + tab.url);
            beginListeningToButtonClicks(tab);
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.includes("https://app.profilebuddy.io/smdashboard") || tab.url.includes("localhost:3000/smdashboard")) {
    //if (tab.url.includes("localhost:3000/smdashboard")) {
        //console.log(changeInfo);
        //console.log("onUpdated->" + tab.url);
        beginListeningToButtonClicks(tab);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.name) {
        case "checkAllowedTabs":
            console.log("allowed tabs are being checked.");
            sendResponse = checkForAllowedTabs();
            //document.getElementById("scraped_count").innerText = message.value;
            break;
        case "hasBeenInjected":
            sendResponse = checkHasBeenInjected(message);
            break;
    }
});

const beginListeningToButtonClicks = (tab) => {
    chrome.runtime.sendMessage({name: "hasBeenInjected", value: true}, (hasBeenInjected) => {
        if (!hasBeenInjected) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: [
                    "content/listenToScrapeButtonClick.js", 
                    "content/listenToDownloadButtonClick.js"
                ],
            });
        }
    });
}

const checkForAllowedTabs = async () => {
    const pbsm = "https://app.profilebuddy.io/smdashboard";  
    const ggs  = "https://www.google.com/search?q";
    const lhsm = "localhost:3000/smdashboard";
    let tabs = await chrome.tabs.query({ currentWindow: true });
    let [currentTab] = await chrome.tabs.query({ active:true, currentWindow: true });
    let allowed = false;
    let currentAllowed = false;
    if (currentTab.url.includes(pbsm) || currentTab.url.includes(lhsm) || currentTab.url.includes(ggs)) {
        currentAllowed = true;
    }
    for (tab of tabs) {
        if (tab.url.includes(pbsm) || tab.url.includes(lhsm)) {
            allowed = true;
        }
    }
    return (currentAllowed && allowed);
    
}

const checkHasBeenInjected = async (message) => {
    const hasBeenInjected = message.hasBeenInjected;
    chrome.storage.local.get("hasBeenInjected", (response) => {
        if (!response.hasBeenInjected) {
            hasBeenInjected = false;
        }
        chrome.storage.local.set({hasBeenInjected});
        return hasBeenInjected;
    });
}