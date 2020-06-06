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
