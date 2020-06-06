
// hostname for Study Words database Server
const SWS_HOSTNAME = "http://localhost:3000";

document.getElementById('w-input').onkeypress = function(event) {
	// key code for enter key
	if (event.keyCode == '13') {
		addWord(document.getElementById('w-input').value);
	}
}

document.getElementById('w-submit').addEventListener("click", function() {
	addWord(document.getElementById('w-input').value);
});


function addWord(word) {
	if (word != "") {
		let request = new XMLHttpRequest();
	  request.open("GET", SWS_HOSTNAME + "/add/" + word, true);
	  request.send();
		window.location.reload();
	}
}








getPracticeWords();

let body = document.body;
let error_dialogue =	'<div class="warning-dialogue">' +
												'<i class="fas fa-exclamation-triangle"></i>'+
												'<i class="fas fa-times"></i>'+
												'Error: Could not Connect to Database'
											'</div>';

function getPracticeWords() {
	let request = new XMLHttpRequest();

  request.open("GET", SWS_HOSTNAME + "/all", true);  // true for asynchronous
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
		document.getElementsByClassName("warning-dialogue")[0].addEventListener("click", function(){
			document.getElementsByClassName("warning-dialogue")[0].remove();
		});
	});
}

let word_list = document.getElementById("word-list");
let word_selector = '<div class="word-selector">'+
											'<button class="remove-selector"><i class="manage-tools far fa-trash-alt"></i></button>';

function callback(practiceWords) {
	let index = 0;
	for (let i = 0; i < Object.keys(Object.entries(practiceWords)).length; i++) {
		let key = Object.values(Object.entries(practiceWords))[i][0];
		let value = Object.values(Object.entries(practiceWords))[i];
		let date = value[1].date_added.split("-").reverse();
		date[0] = date[0].substring(0, 2)
		date = date.join('.');
	  word_list.innerHTML += word_selector + key + '<span>' + date + '</span></div>';
		document.getElementsByTagName("button")[index].id = index;
		index++;
	}
	let remove_selectors = document.getElementsByClassName("remove-selector");
	for (let i = 0; i < remove_selectors.length; i++) {
    remove_selectors[i].addEventListener('click', function() {
			console.log(i);
			removeItem(remove_selectors[i].id);
		});
	}
}

function removeItem(index) {
	console.log(index);
	let selector = document.getElementById(index).parentElement;
	let request = new XMLHttpRequest();
  request.open("GET", SWS_HOSTNAME + "/remove/" + selector.innerText.split("\n")[0], true);  // true for asynchronous
  request.send();
	selector.remove();
}
