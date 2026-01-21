const option1 = document.getElementById('Buff163check');
const option2 = document.getElementById('Pricempirecheck');
const option3 = document.getElementById('Skinportcheck');
const option4 = document.getElementById('Csfloatcheck');


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


function restoreOptions() {
const restoreOptions = chrome.storage.sync.get({
    BuffEnabled: true,
    PricempireEnabled: true,
    SkinportEnabled: true,
    CsfloatEnabled: true
}).then((items) => {
    option1.checked = items.BuffEnabled;
    option2.checked = items.PricempireEnabled;
    option3.checked = items.SkinportEnabled;
    option4.checked = items.CsfloatEnabled;
})};

restoreOptions();

chrome.storage.onChanged.addListener((changes, area) => {
    restoreOptions();
});