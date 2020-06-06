
if (window.location.href.includes("home.html")){
  document.body.onkeypress = function(event) {
    if (event.keyCode == '13') {
     window.location.href = window.location.href.replace("home.html", "quiz.html");
    }
  }
}

if (window.location.href.includes("complete.html")){
  document.getElementsByTagName("span")[0].innerText = window.location.href.split("?")[1] + " word";
  if (window.location.href.split("?")[1] != "1") {
    document.getElementsByTagName("span")[0].innerText += 's';
  }
}

/*
function getVoiceKey() {
  let request = new XMLHttpRequest();
  request.open("GET", "http://localhost:3000/keys/get", true);
  request.send();

  request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status == 200) {
      let key = JSON.parse(request.responseText).ResponsiveVoice_API_Key;
      document.body.innerHTML += `<script src="https://code.responsivevoice.org/responsivevoice.js?key=${key}"></script>`
      return;
    }
  }
}

getVoiceKey();
*/
