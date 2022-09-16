let scrapeBtn = document.getElementById("scrapeBtn");

scrapeBtn.addEventListener("click", async () => {

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.url.includes("localhost:3000/smdashboard/")) {
        chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content/scrapeData.js"],
            })
    } else {
        document.getElementById("content").innerText='<object type="type/html" data="err.html" ></object>';
    }
});

let downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", async () => {
    // TODO: implement downloading of data into a csv file
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.url.includes("localhost:3000/smdashboard/")) {
        chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content/downloadData.js"],
            })
    } else {
        document.getElementById("content").innerText='<object type="type/html" data="err.html" ></object>';
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