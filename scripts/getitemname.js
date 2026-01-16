export function getitemname(URL) {
    String(URL);
    if (!(URL.includes("steamcommunity.com/market/listings/730")))
        return;
    let itemName = URL.split("/730/")[1];
    itemName = itemName.split("?l")[0];
    return itemName;
};

export function getitemnamedec(URL) {
    String(URL);
    if (!(URL.includes("steamcommunity.com/market/listings/730")))
        return;
    let itemName = URL.split("/730/")[1];
    itemName = itemName.split("?l")[0];
    return decodeURIComponent(itemName);
}