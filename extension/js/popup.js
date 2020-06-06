
let blacklist;
let active = false;
let hostname;
let checkbox = document.getElementsByClassName("b-checkbox")[0];
let refresh = false;

let disabled = [ "docs.google.com", "google.com", "google.com.au" ]
const SWS_HOSTNAME = "http://localhost:3000";

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  hostname = tabs[0].url.replace('www.', '');
  hostname = hostname.substring(hostname.indexOf("://") + 3, hostname.length);
  hostname = hostname.substring(0, hostname.indexOf("/"));
  document.getElementsByTagName("span")[1].innerHTML = "site: " + hostname;

if (hostname.includes(".") && !(disabled.includes(hostname))) {
  let request = new XMLHttpRequest();
  request.open("GET", SWS_HOSTNAME + "/blacklist/", true);
  request.send();

  request.onreadystatechange = () => {
    // ensures function is only executed once (CORS sends multiple)
    if (request.readyState == 4 && request.status == 200) {
      blacklist = JSON.parse(request.responseText);
      active = !(blacklist.includes(hostname));
      callback();
      return;
    }
  }

  function callback() {
    if (active) {
      checkbox.className = "b-checkbox enabled";
      document.getElementsByClassName("isEnabled")[0].innerText = 'Enabled';
    }
    else {
      checkbox.className = "b-checkbox disabled";
      document.getElementsByClassName("isEnabled")[0].innerText = 'Disabled';
    }
  }

  checkbox.addEventListener("click", function() {
    if (!(refresh)) {
      active = !active;
      if (active) {
        let request = new XMLHttpRequest();
        request.open("GET", SWS_HOSTNAME + "/blacklist/remove/" + hostname, true);  // true for asynchronous
        request.send();
        checkbox.innerHTML = `Enabled<br><span>*<span class="refresh">Refresh</span> to apply changes</span>`;
      } else {
        let request = new XMLHttpRequest();
        request.open("GET", SWS_HOSTNAME + "/blacklist/add/" + hostname, true);  // true for asynchronous
        request.send();
        checkbox.innerHTML = `Disabled<br><span>*<span class="refresh">Refresh</span> to apply changes</span>`;
      }
      awaitRefresh();
      callback();
    }
  });

  function awaitRefresh() {
    document.getElementsByClassName("refresh")[0].addEventListener("click", function () {
      refresh = true;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        window.close();
      });
    });
  }
} else {
  document.getElementsByClassName("b-checkbox enabled")[0].remove();
  document.getElementsByClassName("b-check")[0].remove();
  document.getElementsByClassName("b-view")[0].remove();
}
});

// check all button
document.getElementsByClassName("b-check")[0].addEventListener("click", function() {
  chrome.runtime.sendMessage({action: "check_all"}, function(response) {
    document.getElementsByClassName("b-check")[0].className = "b-check-after";
    document.getElementsByClassName("b-check-after")[0].style.fontWeight = 100;
    document.getElementsByClassName("b-check-after")[0].innerText = "0 Words Checked";
  });

  //chrome.runtime.sendMessage({from:"script1",message:"hello!"});
});


/*
// message reciveved and processed by background.js, which returns 'practiceWords' array
chrome.runtime.sendMessage("get_practice_words", function(response) {
  for (i = 0; i < response.length; i++) {
    document.getElementsByTagName("pre")[0].innerHTML += "</br> - " + response[i];
  }
});

// function tells background to tell background.js to clear the practiceWords array,
// emptys the wordlist shown in popup.html, and clears the icon badge
document.getElementById("reset").addEventListener("click", function() {
  chrome.browserAction.setBadgeText({text: ''});
  chrome.runtime.sendMessage("reset", function(response) {});
  document.getElementsByTagName("pre")[0].innerHTML = "Words To Practice:";

});
*/
