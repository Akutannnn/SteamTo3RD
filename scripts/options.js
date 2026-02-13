const option1 = document.getElementById('Buff163check');
const option2 = document.getElementById('Pricempirecheck');
const option3 = document.getElementById('Skinportcheck');
const option4 = document.getElementById('Csfloatcheck');
const option5 = document.getElementById('Steammarketcheck');
const option6 = document.getElementById('Steaminventorycheck');
const option7 = document.getElementById('Csgoskinscheck');


option1.addEventListener('change', () => {
    chrome.storage.sync.set({ BuffEnabled: option1.checked });
});

option2.addEventListener('change', () => {
    chrome.storage.sync.set({ PricempireEnabled: option2.checked });
});

option3.addEventListener('change', () => {
    chrome.storage.sync.set({ SkinportEnabled: option3.checked });
});

option4.addEventListener('change', () => {
    chrome.storage.sync.set({ CsfloatEnabled: option4.checked });
});

option5.addEventListener('change', () => {
    chrome.storage.sync.set({ SteammarketEnabled: option5.checked });
});

option6.addEventListener('change', () => {
    chrome.storage.sync.set({ SteaminventoryEnabled: option6.checked });
});

option7.addEventListener('change', () => {
    chrome.storage.sync.set({ CsgoskinsEnabled: option7.checked });
});


function restoreOptions() {
const restoreOptions = chrome.storage.sync.get({
    BuffEnabled: true,
    PricempireEnabled: true,
    SkinportEnabled: true,
    CsfloatEnabled: true,
    CsgoskinsEnabled: true,
    SteammarketEnabled: true,
    SteaminventoryEnabled: true
}).then((items) => {
    option1.checked = items.BuffEnabled;
    option2.checked = items.PricempireEnabled;
    option3.checked = items.SkinportEnabled;
    option4.checked = items.CsfloatEnabled;
    option5.checked = items.SteammarketEnabled;
    option6.checked = items.SteaminventoryEnabled;
    option7.checked = items.CsgoskinsEnabled;
})};

restoreOptions();

chrome.storage.onChanged.addListener((changes, area) => {
    restoreOptions();
});