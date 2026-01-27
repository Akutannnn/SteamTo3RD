//REFRESH WHEN OPTION CHANGE
chrome.storage.onChanged.addListener((changes, area) => {
    window.location.reload();;
});



let BuffEnabled;
let PricempireEnabled;
let SkinportEnabled;
let CsfloatEnabled;
let SteammarketEnabled;

async function getOptions() {
    const opt = await chrome.storage.sync.get({
        BuffEnabled: true,
        PricempireEnabled: true,
        SkinportEnabled: true,
        CsfloatEnabled:true,
        SteammarketEnabled:true
    });
        //Buff163 Setting
        if (opt.BuffEnabled !== undefined) {
            BuffEnabled = opt.BuffEnabled;
        }
        else {
            BuffEnabled = true;
            console.log("Buff option not found, setting to default (enabled).");
        };
        //Pricempire Setting
        if (opt.PricempireEnabled !== undefined) {
            PricempireEnabled = opt.PricempireEnabled;
        }
        else {
            PricempireEnabled = true;
            console.log("Pricempire option not found, setting to default (enabled).");
        };
        //Skinport Setting
        if (opt.SkinportEnabled !== undefined) {
            SkinportEnabled = opt.SkinportEnabled;
        }
        else {
            SkinportEnabled = true;
            console.log("Skinport option not found, setting to default (enabled).");
        };
        //Csfloat Setting
        if (opt.CsfloatEnabled !== undefined) {
            CsfloatEnabled = opt.CsfloatEnabled;
        }
        else {
            CsfloatEnabled = true;
            console.log("Csfloat option not found, setting to default (enabled).");
        };
        //Check if extension enabled on Steam Market Setting
        if (opt.SteammarketEnabled !== undefined) {
            SteammarketEnabled = opt.SteammarketEnabled;
        }
        else {
            SteammarketEnabled = true;
            console.log("Steam Market option not found, setting to default (enabled).");
        }
}

async function main(){
    await getOptions();
console.log("Steam to 3rd party extension loaded.");

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
        const url = chrome.runtime.getURL('/scripts/data/marketids.json');
        itemsDataPromise = fetch(url).then(r => r.json());
    }
    return itemsDataPromise;
    };


//BUFF163 INTEGRATION
let buffinsert = "";
if (BuffEnabled) {

    const buffimgurl = chrome.runtime.getURL('/images/marketicons/buff163icon.png');

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
    const pricempireimgurl = chrome.runtime.getURL('/images/marketicons/pricempireicon.png');
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
    else if (itemNamedec.toLowerCase().includes("case") && !(itemNamedec.includes("|"))){
        let casename = itemNamedec.replaceAll(" ", "-").replaceAll(":", "").toLowerCase();
        PricempireURL = `https://pricempire.com/cs2-items/container/${casename}?variant=${casename}`;
        pricempireinsert = `<a href="${PricempireURL}" target="_blank"><img class="icons" src="${pricempireimgurl}" alt="Pricempire"></a>`;
    }
    else {
        PricempireURL = `https://pricempire.com/cs2-skin-search?q=${itemNamedec}`;
        pricempireinsert = `<a href="${PricempireURL}" target="_blank"><img class="icons" src="${pricempireimgurl}" alt="Pricempire"></a>`;
    }
};


let skinportinsert = ""
if (SkinportEnabled) {
    const skinportimgurl = chrome.runtime.getURL('/images/marketicons/skinporticon.png');
    let SkinportURL = "https://skinport.com/market?search=";
    let searchname;
    let stattrak = false;
    let souvenir = false;
    let exterior = null;

    if (itemNamedec.includes("Factory New") || itemNamedec.includes("Minimal Wear") || itemNamedec.includes("Field-Tested") || itemNamedec.includes("Well-Worn") || itemNamedec.includes("Battle-Scarred")) {
        if (itemNamedec.includes("Souvenir")) {
            souvenir = false;
            searchname = itemNamedec.replace("Souvenir", "").trim()
        }
        else if (itemNamedec.includes("StatTrak™")) {
            stattrak = false;
            searchname = itemNamedec.replace("StatTrak™", "")
        }
        else {
            searchname = itemNamedec
        };
        if (itemNamedec.includes("Factory New")) exterior = 2;
        else if (itemNamedec.includes("Minimal Wear")) exterior = 4;
        else if (itemNamedec.includes("Field-Tested")) exterior = 3;
        else if (itemNamedec.includes("Well-Worn")) exterior = 5;
        else if (itemNamedec.includes("Battle-Scarred")) exterior = 1;


    switch (exterior) {
        case 2: searchname = searchname.replace("(Factory New)", ""); break;
        case 4: searchname = searchname.replace("(Minimal Wear)", ""); break;
        case 3: searchname = searchname.replace("(Field-Tested)", ""); break;
        case 5: searchname = searchname.replace("(Well-Worn)", ""); break;
        case 1: searchname = searchname.replace("(Battle-Scarred)", ""); break;
        default: break;
    }

    SkinportURL += searchname.trim()

    }

    //VANILLE KNIVES
    else if (!(itemNamedec.includes("|")) && itemNamedec.includes ("★")){
        let vanillaname = ""
        if (itemNamedec.includes("★ StatTrak™")) {
            vanillaname = (itemNamedec.replace("★ StatTrak™", "")).trim().toLowerCase();
            vanillaname = vanillaname.replace(" ", "-");
            stattrak = true
        }
        else {
            vanillaname = itemNamedec.replace("★", "").trim().toLowerCase();
            vanillaname = vanillaname.replace(" ", "-");
        }
    SkinportURL = `https://skinport.com/market/knife/${vanillaname}?item=Vanilla`
    }

    else {
        SkinportURL += itemNamedec
    }

    if (stattrak) {
        SkinportURL += "&stattrak=1"
    }
    else if (!stattrak) {
        SkinportURL += "&stattrak=0"
    };

    if (souvenir) {
        SkinportURL += "&souvenir=1"
    }
    else if (!souvenir) {
        SkinportURL += "&souvenir=0"
    };

    if (exterior == null) {
    }
    else {
        switch (exterior) {
            case 2: SkinportURL += "&exterior=2"; break;
            case 4: SkinportURL += "&exterior=4"; break;
            case 3: SkinportURL += "&exterior=3"; break;
            case 5: SkinportURL += "&exterior=5"; break;
            case 1: SkinportURL += "&exterior=1"; break;
            default: break;
    }
    };

    SkinportURL += "&sort=price&order=asc";
    skinportinsert += `<a href="${SkinportURL}" target="_blank"><img class="icons" src="${skinportimgurl}" alt="Skinport"></a>`;

}

let csfloatinsert = "";
if (CsfloatEnabled) {
    const csfloatimgurl = chrome.runtime.getURL('/images/marketicons/csfloaticon.png');
    let CsfloatURL = `https://csfloat.com/search?market_hash_name=${itemNamedec}`;
    csfloatinsert = `<a href="${CsfloatURL}" target="_blank"><img class="icons" src="${csfloatimgurl}" alt="Csfloat"></a>`;
}



//INSERTION IN PAGE
async function buildAndInsert() {
  await Promise.resolve(BuffEnabled? fetchBuff?.() : undefined);

    if (BuffEnabled) whattoinsert += buffinsert;

    if (PricempireEnabled) whattoinsert += pricempireinsert;

    if (SkinportEnabled) whattoinsert += skinportinsert;

    if (CsfloatEnabled) whattoinsert += csfloatinsert;

    if (BuffEnabled || PricempireEnabled || SkinportEnabled || CsfloatEnabled){
        whattoinsert += `<h1>Steam to 3RD Party</h1>`
    };

    whattoinsert += ` `;
    whattoinsert += `</div>`;
    if (wheretoinsert !== null) {
        wheretoinsert.insertAdjacentHTML("beforebegin", whattoinsert);};
}

buildAndInsert()

}

(async () => {
    await getOptions();
    if (SteammarketEnabled) {
        main();
    }
    else {
        console.log("Extension disabled on Steam Market.");
    }
})();