downloadButton = document.getElementById("downloadButton");

downloadButton.addEventListener("click", () => {
    
    chrome.storage.local.get("total_rows_processed", ({ total_rows_processed }) => {
        csvContent = "data:text/csv;charset=utf-8;,";
        /* + total_rows_processed.map(row => {
            return (row.title!=="undefined"?row.title:" " + "," + row.email!=="undefined"?row.email:" " + "," + row.profile_url!=="undefined"?row.profile_url:" " + "\r\n");  
        }); */
    
        csvContent += "\"TITLE\",\"EMAIL\",\"PROFILE_URL\"\r\n";
        total_rows_processed.forEach((row) => {
            csvContent += row.title !== undefined ? "\"" + row.title + "\"" : "\"\"";
            csvContent += ",";
            csvContent += row.email !== undefined ? "\"" + row.email + "\"" : "\"\"";
            csvContent += ",";
            csvContent += row.profile_url !== "undefined" ? "\"" + row.profile_url + "\"" : "\"\"";
            csvContent += "\r\n";
        });

        ///////// PROCEDURE 1 /////////////
        let encodedUri = encodeURI(csvContent);
        //let link = document.createElement("a");  // let's just refer to existing element
        let link = document.getElementById("forCsvFileDownload");
        if (link.tagName === "A" && chrome.runtime && !!chrome.runtime.getManifest() /* isValidChromeRuntime() */ ) {
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "sm_extracted_data.csv");
            console.log("about to download the csv file");
            //document.body.appendChild(link); // Required for FF (but it already exists)
            link.click(); // This will download the data file named "sm_extracted_data.csv".
            //=====

            ////////// PROCEDURE 2 ///////////////
            // let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            // let url = URL.createObjectURL(blob);
            // chrome.downloads.download({
            //     url: url,
            //     filename: "sm_extracted_data.csv"
            // });
            //=====

            chrome.storage.local.set({total_rows_processed: []});
            processed_rows = 0;
            chrome.storage.local.set({ processed_rows });
            document.getElementById("scraped_total_count").innerText = "0";
        } else {
            alert("Something went wrong. No file was downloaded.");
        }
    });

});


/* const isValidChromeRuntime = () => {
    return chrome.runtime && !!chrome.runtime.getManifest();
} */