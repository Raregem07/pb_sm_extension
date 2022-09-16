downloadButton = document.getElementById("downloadButton");

downloadButton.addEventListener("click", async () => {
    
    chrome.storage.local.get("total_rows_processed", ({ total_rows_processed }) => {
        csvContent = "data:text/csv;charset=utf-8,";
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
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sm_extracted_data.csv");
        document.body.appendChild(link); // Required for FF
    
        link.click(); // This will download the data file named "sm_extracted_data.csv".
        chrome.storage.local.set({total_rows_processed: []});
        document.getElementById("scraped_total_count").innerText = "0";
    });

});
