const getObject = async (key) => {
    return new Promise((res, rej) => {
      chrome.storage.local.get([key], function(result) {
        res(result[key]);
      });
    });
}
  
const saveObject = async (key, value) => {
    return new Promise((res) => {
      chrome.storage.local.set({ [`${key}`]: value }, () => {
        res("saved");
      });
    });
}

const appendToArray = async (key, arrayValue) => {
    let value = await getObject(key);
    if (value === undefined || value === null) {
        await saveObject(key, arrayValue);
    } else {
        value = value.concat(arrayValue);
        await saveObject(key, value);
    }
}