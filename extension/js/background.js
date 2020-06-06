
// Private Key for Bing Spell Check API
// TODO: Find way to ensure Key is not stored in plain text in scripts
const KEY = "";

// URL template for making a request in Australian English (text to check added to the end)
const REQUEST_TEMPLATE = "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/?mode=proof&mkt=en-AU&text=";

// hostname for Study Words database Server
const SWS_HOSTNAME = "http://localhost:3000"

function returnJSON(object, index) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: "return_json", json: object, area: index});
  });

  // adds each of the flagged words to the practiceWords array
  for (i = 0; i < object["flaggedTokens"].length; i++) {
    let flaggedWord = object["flaggedTokens"][i]["suggestions"][0]["suggestion"];

    let request = new XMLHttpRequest();
    request.open("GET", SWS_HOSTNAME + "/add/" + flaggedWord, true);  // true for asynchronous
    request.send();
  }

  let notification = {
    type: 'basic',
    iconUrl: 'https://i.ibb.co/tQHXFbC/icon16.png',
    title: `${object["flaggedTokens"].length} words added to your word list`,
    message: ``
  };
  chrome.notifications.create(notification);
}

// sends message to interface.js to handle delivering the error
function returnError(error) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: "return_error", error_info: error});
  });
}


chrome.runtime.onMessage.addListener(
  function (request_details, sender, sendResponse) {
    // text and index are given as an array to keep them within a single function parameter
    text = encodeURIComponent(request_details[0]);
    index = request_details[1];

    let request = new XMLHttpRequest();

    try {
      request.open("GET", REQUEST_TEMPLATE + text);
    }
    catch (error) {
      // usually indicates an error in code, or server-side error
      returnError("Bad request");
      return;
    }

    // Will return 401 'Access Denied' error if incorrect key is provided
    request.setRequestHeader("Ocp-Apim-Subscription-Key", KEY);

    request.addEventListener("load", function() {
      if (this.status === 200) {
        // returns JSON and converts to object
        returnJSON(JSON.parse(this.responseText), index);
      }
      else {
        // returns any errors from bing server
        returnError(this.statusText + ": " + this.responseText);
      }
    });

    // common error, usually occurs when internet is disconected
    request.addEventListener("error", function() {
      returnError("Could not send request (network error)");
    });

    // uncommon, but was suggested in Bing documentation and may prove useful as more features are added
    request.addEventListener("abort", function() {
      returnError("Aborted");
    });

    request.send();
    // return used to ensure asynchronous function is complete
    return;
  }
);
