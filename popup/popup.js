import {getitemname,getitemnamedec} from "../scripts/getitemname.js";
import {getBuffID, getBuffURL} from "../scripts/getbuffid.js";


const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const URL = tab?.url;

if (URL.includes("steamcommunity.com/market/listings/730")) {

  const className = 'f6hU22EA7Z8peFWZVBJU'
  const item_name = getitemnamedec(URL);
  const buff_url = await getBuffURL(item_name);

  const [{ result: rgb }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (cls) => {
      const el = document.querySelector("." + cls);
      if (!el) return null;
      return getComputedStyle(el).color;
    },
  args: [className]
});
  document.body.innerHTML += '<h2 style="color:' + rgb + '">' + item_name + '</h2<br>';
  document.body.innerHTML += '<a href=' + buff_url + ' class="button" target="_blank"> View on Buff163 </a>';
}