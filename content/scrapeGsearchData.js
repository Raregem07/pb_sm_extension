getObject = async (key) => {
    return new Promise((res, rej) => {
      chrome.storage.local.get([key], (result) => {
        res(result[key]);
      });
    });
}
  
saveObject = async (key, value) => {
    return new Promise((res) => {
      chrome.storage.local.set({ [`${key}`]: value }, () => {
        res("saved");
      });
    });
}

appendToArray = async (key, arrayValue) => {
    let value = await getObject(key);
    if (value === undefined || value === null) {
        await saveObject(key, arrayValue);
    } else {
        value = value.concat(arrayValue);
        await saveObject(key, value);
    }
}

search_rows = Array.from(document.querySelectorAll("div.MjjYud"));
console.log(search_rows);
search_rows.map( async (search_row) => {
    const container = {};
    console.log(search_row);

    //const inner_html = search_row.innerHTML;
    container.title = await search_row.querySelector(
        "h3.LC20lb.MBeuO.DKV0Md"
    ).innerText;
    container.profile_url = await search_row.querySelector(
        "a > div > cite"
    ).textContent;
    const dirty_email = await search_row.querySelector(
        "div.VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf"
    ).textContent;

    const dirty_list = await dirty_email.split(" ")
    .map(item => {
        let tmp = item.trim();
        if (tmp.endsWith('.')) {
            tmp = tmp.substring(0, tmp.length-2);
        }
        if (tmp.startsWith('mailto:')) {
            tmp = tmp.substring(7);
        }
        return tmp;
    })
    // gmail outlook protonmail yahoo hotmail zoho icloud
    for (let i = 0; i < dirty_list.length; i++) {
        if (dirty_list[i].includes("@gmail.com")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@gmail.com")+10);
            break;
        } else if (dirty_list[i].includes("@gmail.co.")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@gmail.co.")+12);
            break;
        } else if (dirty_list[i].includes("@yahoo.com")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@yahoo.com")+10);
            break;
        } else if (dirty_list[i].includes("@yahoo.co.")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@yahoo.co.")+12);
            break;
        } else if (dirty_list[i].includes("@hotmail.com")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@hotmail.com")+12);
            break;
        } else if (dirty_list[i].includes("@hotmail.co.")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@hotmail.co.")+14);
            break;
        } else if (dirty_list[i].includes("@outlook.com")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@outlook.com")+12);
            break;
        }  else if (dirty_list[i].includes("@protonmail.com")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@protonmail.com")+15);
            break;
        } else if (dirty_list[i].includes("@zoho.com")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@zoho.com")+9);
            break;
        } else if (dirty_list[i].includes("@icloud.com")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@icloud.com")+11);
            break;
        } else if (dirty_list[i].includes("@aol.com")) {
            container.email = dirty_list[i].substring(0, dirty_list[i].indexOf("@aol.com")+8);
            break;
        }
    }
    
    return container;
})
//const gs_title = document.getElementsByClassName("a.gs-title");
/* let gs_titles = Array.from(
    document.querySelectorAll("a.gs-title")
).map((gs_title) => gs_title.textContent); */
console.log("rows.length = " + search_rows.length);
console.log(search_rows);

if (search_rows.length > 0) {
    appendToArray("total_rows_processed", search_rows);
}

chrome.storage.local.get("processed_rows", ({ processed_rows }) => {
    processed_rows += search_rows.length;
    chrome.runtime.sendMessage({name: "totalProcessedRows", value: processed_rows});
    // set 'Total rows scraped' value to be replaced by processed_rows value
    chrome.storage.local.set({ processed_rows });
});



//console.log(gs_titles);
//console.log(rows[0]);
// for (let i = 0; i < rows.length; i++) {
//     const gs_title = rows[i].document.getElementsByClassName("a gs-title").innerText;
//     console.log(gs_title)
// }


//#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(4) > div.gs-webResult.gs-result > div.gsc-url-top > div.gs-bidi-start-align.gs-visibleUrl.gs-visibleUrl-breadcrumb
//#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(8)