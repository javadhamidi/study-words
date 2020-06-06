
// hostname for Study Words database Server
const SWS_HOSTNAME = "http://localhost:3000";


let edit_blacklist = document.getElementsByClassName("edit-blacklist")[0];

edit_blacklist.addEventListener("click", function () {
  edit_blacklist.innerHTML = "Save";
  document.getElementsByClassName("blacklist")[0].disabled = false;
  document.getElementsByClassName("edit-blacklist")[0].className = "sbutton submit save-blacklist";
  blacklistConfirmation();
});

function blacklistConfirmation() {
  document.getElementsByClassName("save-blacklist")[0].addEventListener("click", function () {
    blacklist = document.getElementsByClassName("blacklist")[0].value.split("\n").filter(n => n);
    if (isURL(blacklist)) {
      let request = new XMLHttpRequest();
      request.open("GET", SWS_HOSTNAME + "/blacklist/edit/" + blacklist, true);  // true for asynchronous
      request.send();
      window.location.reload();
    } else {
      document.getElementsByClassName("blacklist")[0].style.border = "#ff4f4f solid 1px";
    }
  });
}

document.getElementsByClassName('blacklist')[0].addEventListener("click", function(event) {
  document.getElementsByClassName('blacklist')[0].style.border = "rgb(169, 169, 169) 1px solid";
})

function isURL(array) {
  for (var i = 0; i < array.length; i++) {
    if (!(array[i].includes("."))) {
      return false;
    }
  }
  return true;
}

getBlacklist();

function getBlacklist() {
  let request = new XMLHttpRequest();
  request.open("GET", SWS_HOSTNAME + "/blacklist/", true);  // true for asynchronous
  request.send();

  request.onreadystatechange = () => {
    // ensures function is only executed once (CORS sends multiple)
    if (request.readyState == 4 && request.status == 200) {
      getBlacklistCallback(JSON.parse(request.responseText));
      return;
    }
  }
}

function getBlacklistCallback(array) {
  document.getElementsByClassName("blacklist")[0].value = array.join("\n")
}

getKeys();

function getKeys() {
	let request = new XMLHttpRequest();
  request.open("GET", SWS_HOSTNAME + "/keys/get", true);  // true for asynchronous
  request.send();

  request.onreadystatechange = () => {
		// ensures function is only executed once (CORS sends multiple)
		if (request.readyState == 4 && request.status == 200) {
			callback(JSON.parse(request.responseText));
			return;
		}
  }

  request.addEventListener("error", function(e) {
  	body.innerHTML += error_dialogue;
  	document.getElementsByClassName("warning-dialogue")[0].addEventListener("click", function() {
  		document.getElementsByClassName("warning-dialogue")[0].remove();
  	});
  });
}

let body = document.body;
let error_dialogue =	'<div class="warning-dialogue">' +
												'<i class="fas fa-exclamation-triangle"></i>'+
												'<i class="fas fa-times"></i>'+
												'Error: Could not Connect to Database'
											'</div>';

function callback(keys) {
  document.getElementsByClassName("input-box")[0].value = keys.Bing_Spell_Check_API_Key;
	document.getElementsByClassName("input-box")[1].value = keys.ResponsiveVoice_API_Key;
}

document.getElementsByClassName("danger-zone")[0].addEventListener("click", function() {
  let request = new XMLHttpRequest();
  request.open("GET", SWS_HOSTNAME + "/resetWords", true);
  request.send();
});

document.getElementsByClassName("danger-zone")[1].addEventListener("click", function() {
  let request = new XMLHttpRequest();
  request.open("GET", SWS_HOSTNAME + "/reset", true);
  request.send();
  window.location.reload();
});

document.getElementsByClassName("danger-zone")[1].addEventListener("click", function() {
  let request = new XMLHttpRequest();
  request.open("GET", SWS_HOSTNAME + "/reset", true);
  request.send();
  window.location.reload();
});


document.getElementsByClassName("submit-form")[0].addEventListener("click", function() {
	changeKeys([document.getElementsByClassName('input-box')[0].value, document.getElementsByClassName('input-box')[1].value]);
});

function changeKeys(keys) {
  console.log(""+keys);
	let request = new XMLHttpRequest();
  request.open("GET", SWS_HOSTNAME + "/keys/update/" + keys, true);
  request.send();
  window.location.reload();
}
