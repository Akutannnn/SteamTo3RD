
const option1 = document.getElementById('Buff163check');
const option2 = document.getElementById('Pricempirecheck');




option1.addEventListener('change', () => {
    chrome.storage.sync.set({ BuffEnabled: option1.checked });
});

option2.addEventListener('change', () => {
    chrome.storage.sync.set({ PricempireEnabled: option2.checked });
});



function restoreOptions() {
const restoreOptions = chrome.storage.sync.get({
    BuffEnabled: true,
    PricempireEnabled: true
}).then((items) => {
    option1.checked = items.BuffEnabled;
    option2.checked = items.PricempireEnabled;
})};

restoreOptions();


chrome.storage.onChanged.addListener((changes, area) => {
    restoreOptions();
});
