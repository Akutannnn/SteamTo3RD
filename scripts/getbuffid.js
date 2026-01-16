let itemsDataPromise;

function loadItemsData() {
  if (!itemsDataPromise) {
    const url = chrome.runtime.getURL('scripts/data/marketids.json');
    itemsDataPromise = fetch(url).then(r => r.json());
  }
  return itemsDataPromise;
};

export async function getBuffID(itemName) {
  const data = await loadItemsData();
  return data.items[itemName].buff163_goods_id;
};

export async function getBuffURL(itemName) {
  const data = await loadItemsData();
  const buffID = data.items[itemName].buff163_goods_id;
  return 'https://buff.163.com/goods/' + buffID;
}