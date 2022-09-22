chrome.runtime.sendMessage({name: "checkAllowedTabs"}, (response) => {
    if (response) {
        document.getElementById("content").style.display = 'block';
        document.getElementById("onlyworks_err").style.display = 'none';
        document.getElementById("scrape_err").style.display = 'none';
        document.getElementById("download_err").style.display = 'none';
    } else {
        document.getElementById("content").style.display = 'none';
        document.getElementById("onlyworks_err").style.display = 'block';
        document.getElementById("scrape_err").style.display = 'none';
        document.getElementById("download_err").style.display = 'none';
    }
});

/* chrome.storage.local.get("popup_err", (popup_err) => {
    if (popup_err === "not_allowed") {
        console.log("showed onlyworks_err");
        document.getElementById("content").style.display = 'none';
        document.getElementById("onlyworks_err").style.display = 'block';
        chrome.storage.local.set({popup_err: "allowed"});
    }
}) */

//let [tab] = chrome.tabs.query({ active: true, currentWindow: true });
/* if (tab.url.includes("https://app.profilebuddy.io/smdashboard") 
    || tab.url.includes("localhost:3000/smdashboard") || tab.url.includes("https://www.google.com/search?q")) {
        document.getElementById("content").style.display = 'block';
        document.getElementById("onlyworks_err").style.display = 'none';

} else {
    console.log("can not be. borrow one from two.");
    document.getElementById("content").style.display = 'none';
    document.getElementById("onlyworks_err").style.display = 'block';
} */

let scrapeBtn = document.getElementById("scrapeBtn");
//let mainBtn = chrome.runtime.
scrapeBtn.addEventListener("click", async () => {

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.url.includes("https://app.profilebuddy.io/smdashboard") 
        || tab.url.includes("localhost:3000/smdashboard")) {
        chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content/scrapeData.js"],
        })
    } else if (tab.url.includes("https://www.google.com/search?q")) {
        chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content/scrapeGsearchData.js"],
            })
    } else {
        document.getElementById("content").style.display = 'none';
        document.getElementById("scrape_err").style.display = 'block';
    }
});

let downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", async () => {
    // TODO: implement downloading of data into a csv file
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.url.includes("https://app.profilebuddy.io/smdashboard") || tab.url.includes("localhost:3000/smdashboard") || tab.url.includes("https://www.google.com/search?q")) {
        chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content/downloadData.js"],
            })
    } else {
        document.getElementById("content").style.display = 'none';
        document.getElementById("download_err").style.display = 'block';
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.name) {
        case "totalProcessedRows":
            document.getElementById("scraped_count").innerText = message.value;
            break;
        case "openExtension":
            break;
    }
});

let okScrapeButton = document.getElementById("okScrapeButton");

okScrapeButton.addEventListener("click", () => {
    document.getElementById("content").style.display = 'block';
    document.getElementById("scrape_err").style.display = 'none';
})

let okDownloadButton = document.getElementById("okDownloadButton");

okDownloadButton.addEventListener("click", () => {
    document.getElementById("content").style.display = 'block';
    document.getElementById("download_err").style.display = 'none';
})

let okOnlyworksButton = document.getElementById("okOnlyworksButton");

okOnlyworksButton.addEventListener("click", () => {
    document.getElementById("content").style.display = 'block';
    document.getElementById("onlyworks_err").style.display = 'none';
})

function okButtonClick() {
    document.getElementById("content").style.display = 'block';
    document.getElementById("scrape_err").style.display = 'none';
    document.getElementById("download_err").style.display = 'none';
}


// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//     console.log(response.farewell);
// });

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
//         console.log(response.farewell);
//     });
// });

/* function reddenPage() {
    document.body.style.backgroundColor = 'red';
}

if(!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reddenPage
    });
  } */