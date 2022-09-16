let search_rows = [];
let processed_rows = 0;
let csvContent = "";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({processed_rows});
    console.log("processed_rows is set to " + processed_rows);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url.includes("localhost:3000/smdashboard")) {
            console.log("onActivated->" + tab.url);
            beginListeningToButtonClicks(tab);
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.includes("localhost:3000/smdashboard")) {
        console.log(changeInfo);
        console.log("onUpdated->" + tab.url);
        beginListeningToButtonClicks(tab);
    }
});

const beginListeningToButtonClicks = (tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content/listenToScrapeButtonClick.js", "content/listenToDownloadButtonClick.js"],
    })
}

