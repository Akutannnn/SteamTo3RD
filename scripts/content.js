// OPTIONS
const BuffEnabled = true;


console.log("SCM to 3rd party extension loaded.");


//ITEM NAME EXTRACTION
const URL = window.location.href;
String(URL);


let itemName;
let itemNamedec;

if (URL.includes("steamcommunity.com/market/listings/730")) {

    itemName = URL.split("/730/")[1];
    itemName = itemName.split("?l")[0];

    itemNamedec = decodeURIComponent(itemName);
};



//INSERTION LOGIC
const isCommodityItem = !!document.querySelector('.market_commodity_order_block');

let wheretoinsert;

if (isCommodityItem) {
    wheretoinsert = document.querySelector('.market_commodity_order_block');  
}
else {
    wheretoinsert = document.getElementById('largeiteminfo_warning');
};


let whattoinsert = `<div id="SCM3RD">`;
whattoinsert += ` `;

let itemsDataPromise;

    function loadItemsData() {
    if (!itemsDataPromise) {
        const url = chrome.runtime.getURL('scripts/data/marketids.json');
        itemsDataPromise = fetch(url).then(r => r.json());
    }
    return itemsDataPromise;
    };


//BUFF163 INTEGRATION
if (BuffEnabled) {

    const buffimgurl = chrome.runtime.getURL('scripts/images/buff163icon.png');

    function fetchBuff() {
        return loadItemsData().then((data) => {
        const buffID = data.items[itemNamedec].buff163_goods_id;
        const buffURL = 'https://buff.163.com/goods/' + buffID;
        if (buffURL==undefined){
            console.log("Error : No BuffURL");
        } else {
            let buffinsert = `<a href="${buffURL}" target="_blank"><img class="icons" src="${buffimgurl}" alt="Buff163"></a>`;
            whattoinsert += buffinsert;
            whattoinsert += ` `;
        };
    })};
};



Promise.all([fetchBuff()]).then(() => {
    console.log("All enabled options loaded.");
    whattoinsert += ` `;
    whattoinsert += `</div>`;
    console.log(whattoinsert);
    if (wheretoinsert !== null) {
        wheretoinsert.insertAdjacentHTML("beforebegin", whattoinsert);};
});
