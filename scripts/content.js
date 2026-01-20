//REFRESH WHEN OPTION CHANGE
chrome.storage.onChanged.addListener((changes, area) => {
    window.location.reload();;
});


let BuffEnabled;
let PricempireEnabled;

async function getOptions() {
    const opt = await chrome.storage.sync.get({
        BuffEnabled: true,
        PricempireEnabled: true
    });
        
        if (opt.BuffEnabled !== undefined) {
            BuffEnabled = opt.BuffEnabled;
        }
        else {
            BuffEnabled = true;
            console.log("Buff option not found, setting to default (enabled).");
        };
        if (opt.PricempireEnabled !== undefined) {
            PricempireEnabled = opt.PricempireEnabled;
        }
        else {
            PricempireEnabled = true;
            console.log("Pricempire option not found, setting to default (enabled).");
        }
}

async function main(){
    await getOptions();


console.log("SCM to 3rd party extension loaded.");

//ITEM NAME EXTRACTION
const URL = window.location.href;
String(URL);
let itemName;
let itemNamedec;
if (URL.includes("steamcommunity.com/market/listings/730")) {

    itemName = URL.split("/730/")[1];
    itemName = itemName.split("?")[0];

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
let buffinsert = "";
if (BuffEnabled) {

    const buffimgurl = chrome.runtime.getURL('images/buff163icon.png');

    function fetchBuff() {
        return loadItemsData().then((data) => {
        const buffID = data.items[itemNamedec].buff163_goods_id;
        const buffURL = 'https://buff.163.com/goods/' + buffID;
        if (buffURL==undefined){
            console.log("Error : No BuffURL");
        } else {
            buffinsert = `<a href="${buffURL}" target="_blank"><img class="icons" src="${buffimgurl}" alt="Buff163"></a>`;
        };
    })};
};


//PRICEMPIRE INTEGRATION (ONLY FOR SKINS)
let pricempireinsert = "";
if (PricempireEnabled) {
    const pricempireimgurl = chrome.runtime.getURL('images/pricempireicon.png');
    let PricempireURL = "https://pricempire.com/cs2-items/skin/"
    if (itemNamedec.includes("Factory New") || itemNamedec.includes("Minimal Wear") || itemNamedec.includes("Field-Tested") || itemNamedec.includes("Well-Worn") || itemNamedec.includes("Battle-Scarred")) {
        let stattrak = false;
        let souvenir = false;
        let condition = null;

        //StatTrak check
        if (itemNamedec.includes("StatTrak™")) {
            stattrak = true;
        };

        //Souvenir check
        if (itemNamedec.includes("Souvenir")) {
            souvenir = true;
        };

        //Condition check
        if (itemNamedec.includes("Factory New")) {
            condition = "factory-new";
        }
        else if (itemNamedec.includes("Minimal Wear")) {
            condition = "minimal-wear";
        }
        else if (itemNamedec.includes("Field-Tested")) {
            condition = "field-tested";
        }
        else if (itemNamedec.includes("Well-Worn")) {
            condition = "well-worn";
        }
        else if (itemNamedec.includes("Battle-Scarred")) {
            condition = "battle-scarred";
        }

        //Get Weapon
        let weaponname = itemNamedec.split(" | ")[0];
        weaponname = weaponname.replace("StatTrak™ ", "");
        weaponname = weaponname.replace("Souvenir ", "");
        weaponname = weaponname.replace(" ", "-");
        weaponname = weaponname.toLowerCase();

        //Get Finish
        let finishname = itemNamedec.split(" | ")[1];

        const conditions = ["(Factory New)", "(Minimal Wear)", "(Field-Tested)", "(Well-Worn)", "(Battle-Scarred)"];
        const re = conditions.join("|");
        const regex = new RegExp(`\\s*\\((${re})\\)\\s*`);
        finishname = finishname.replace(regex, "");


        finishname = finishname.replace(" ", "-");
        finishname = finishname.toLowerCase();

        //Construct URL
        PricempireURL += weaponname + "-" + finishname;
        if (stattrak) {
            PricempireURL += "?variant=stattrak" + "-" + condition;
        }
        if (souvenir) {
            PricempireURL += "&variant=souvenir" + "-" + condition;
        }
        else if (!stattrak && !souvenir) {
        PricempireURL += "?variant=" + condition;
        }
        pricempireinsert = `<a href="${PricempireURL}" target="_blank"><img class="icons" src="${pricempireimgurl}" alt="Pricempire"></a>`;
    }
    //VANILLA KNIVES
    else if (!(itemNamedec.includes("|")) && itemNamedec.includes ("★")){
        let vanillaname = ""
        if (itemNamedec.includes("★ StatTrak™")){
            vanillaname = (itemNamedec.replace("★ StatTrak™", "")).trim().toLowerCase();
            vanillaname = vanillaname.replace(" ", "-");
            PricempireURL += vanillaname;
            PricempireURL += "?variant=stattrak";
        }
        else {
            vanillaname = itemNamedec.replace("★", "").trim().toLowerCase();
            vanillaname = vanillaname.replace(" ", "-");
            PricempireURL += vanillaname;
        }
        pricempireinsert = `<a href="${PricempireURL}" target="_blank"><img class="icons" src="${pricempireimgurl}" alt="Pricempire"></a>`;
    }
};



//INSERTION IN PAGE
async function buildAndInsert() {
  await Promise.resolve(BuffEnabled? fetchBuff?.() : undefined);

    if (BuffEnabled) whattoinsert += buffinsert;

    if (PricempireEnabled) whattoinsert += pricempireinsert;

    whattoinsert += ` `;
    whattoinsert += `</div>`;
    if (wheretoinsert !== null) {
        wheretoinsert.insertAdjacentHTML("beforebegin", whattoinsert);};
}

buildAndInsert()

}

main()