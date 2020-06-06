
// simple array of sites were adding check buttons has been found unnecesary or disruptive
// TODO: implement more reliable system for storing whitelist, in an external file
let request = new XMLHttpRequest();
request.open("GET", "http://localhost:3000/blacklist", true);
request.send();

request.onreadystatechange = () => {
  // ensures function is only executed once (CORS sends multiple)
  if (request.readyState == 4 && request.status == 200) {
    blacklist = JSON.parse(request.responseText);
    if (!(blacklist.includes(window.location.hostname))) {
      //if (window.location.hostname == "mail.google.com") { inputType = document.getElementsByClassName('Am Al editable LW-avf'); }
      //if (window.location.hostname.split(".")[0] == 'webmail') { inputType = 'Am Al editable LW-avf'; }
      else {inputType = document.getElementsByTagName('textarea');}
      loadButton();
    }
    return;
  }
}

/*
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

let observer = new MutationObserver(function(mutations, observer) {
  console.log("hello");
    loadButton();
});
*/

document.getElementsByTagName('head')[0].innerHTML += `<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">`;

let isButton = false;

document.body.onclick = function() {
  if (!isButton) {
    for (let i = 0; i < document.getElementsByClassName("sw-check-b").length; i++) {
      document.getElementsByClassName("sw-check-b")[i].remove();
    }
    loadButton();
  }
};

function loadButton() {
  // if the number of 'textarea's on the page is greater than zero,
  // each area is iterated over and button element is added below
  if (inputType.length > 0 && !(blacklist.includes(window.location.hostname))) {
    for (i = 0; i < inputType.length; i++) {
      let button = document.createElement("button");
      button.innerHTML = `<img style="padding-top: 2.5px; margin-left: -0.5px; width: 9px;" src="https://i.ibb.co/RvXwmkV/icon-alt.png">`;
      button.id = `button${i}`;
      button.className = `sw-check-b`;
      button.style = `font-size: 9px;
                      border: none;
                      background-color: #fe5454;
                      cursor: pointer;
                      border-radius: 50%;
                      color: white;
                      height: 20px;
                      width: 20px;
                      display: block;
                      text-align: center;
                      right: 50px;
                      outline: none;`;
      // the onlick attribute of each of added buttons calls a chrome function to broadcast
      // a list containting the textarea value and index, to be recieved by the background.js script
      button.onclick = function() {
        isButton = true;
        chrome.runtime.sendMessage(
          [
            inputType[Number(button.id.replace("button",""))].value,
            Number(button.id.replace("button",""))
          ]
        );
        setTimeout(function() {
          button.innerHTML = `<i class="fas fa-check"></i>`;
          isButton = false;
        }, 1000);
      };
      inputType[i].parentNode.appendChild(button);
    }
  }
}

// listener for response from background.js script after onclick runtime message sent
chrome.runtime.onMessage.addListener(
  // default parameters for handling listener events, currently only the 'request' parameter is used
  function(request, sender, sendResponse) {
    if (request.action == "check_all") {
      console.log("it works!!!");
      sendResponse(inputType.length);
      chrome.runtime.sendMessage(
        [
          inputType[Number(button.id.replace("button",""))].value,
          Number(button.id.replace("button",""))
        ]
      );
    }

    // listens for request send from 'returnError' function in background.js script,
    // and logs error to console
    if (request.action == "return_error") {
      alert(request.error_info);
      console.warn(request.error_info);
    }

    // listens for request send from 'returnJSON' function in background.js script,
    // and replaces each word spelled incorrectly with the top suggestion from the json file
    if (request.action == "return_json") {

      // iterates over each 'flaggedToken' - words that the Bing Spell Check API have flagged as incorrect
      for (i = 0; i < request.json["flaggedTokens"].length; i++) {
        inputType[request.area].value =
        inputType[request.area].value.replace(
          request.json["flaggedTokens"][i]["token"],
          request.json["flaggedTokens"][i]["suggestions"][0]["suggestion"]
        );
      }

      /*
      let notification = `<div class="alert-dialogue" style="
                              font-family: Segoe UI, Tahoma, sans-serif;
                              font-size: 12px;
                              display: block;
                              position: absolute;
                              right: 50px;
                              top: 40px;
                              padding: 13px 20px;
                              background-color: #48db6a;
                              border-radius: 3px;
                              color: white;
                              font-weight: 500;
                              z-index: 100;
                              user-select: none;
                              opacity: 0.9;
                            ">` + String.toString(request.json["flaggedTokens"].length) + ` words added</div>`;

      document.body.innerHTML += notification;

      window.setTimeout(function() { document.getElementsByClassName("alert-dialogue")[0].remove(); }, 3000);
      */
    }
  });
