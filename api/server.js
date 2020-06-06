let express = require('express');  //
let fs = require('fs');  // file system package

let temp = fs.readFileSync('data.json');
let modifiedData = JSON.parse(temp);
console.log(modifiedData);

temp = fs.readFileSync('defaults.json');
let defaults = JSON.parse(temp);

console.log('server is starting');
let app = express();
let server = app.listen(3000, listening);

function listening() {
  console.log('listening...');
}

app.get('/add/:word', addWord);
app.get('/remove/:word', removeWord);
app.get('/all', getWords);
app.get('/resetWords', removeAll);

function addWord(request, response) {
  let word = request.params.word;

  if (!(word in modifiedData.practiceWords)) {
    date = new Date;
    modifiedData.practiceWords[word] = { "date_added": date }
    console.log(modifiedData.practiceWords);
    let data = JSON.stringify(modifiedData, null, 2);
    fs.writeFile('data.json', data, finished);
    function finished() { console.log(word, "added on", date); }

    reply = {
      success: true,
      message: "phrase successfully added",
      phrase: word,
      date: date
    }

    response.send(reply);
  }
  else {
    reply = {
      success: false,
      message: "phrase already in array, could not be added",
      phrase: word
    }
    response.send(reply);
  }
}

function removeWord(request, response) {
  let word = request.params.word;

  if (word in modifiedData.practiceWords) {
    delete modifiedData.practiceWords[word]

    let data = JSON.stringify(modifiedData, null, 2);
    fs.writeFile('data.json', data, finished);
    function finished() { console.log(word, "removed"); }

    reply = {
      success: true,
      message: "phrase successfully removed",
      phrase: word
    }

    response.send(reply);
  }
  else {
    reply = {
      success: false,
      message: "word not found in array",
      phrase: word
    }
    response.send(reply);
  }
}

function getWords(request, response) {
  response.send(modifiedData.practiceWords);
}

function removeAll(request, response) {
  modifiedData.practiceWords = [];

  let data = JSON.stringify(modifiedData, null, 2);
  fs.writeFile('data.json', data, finished);
  function finished() { console.log("practiceWords array emptied"); }

  reply = {
    success: true,
    message: "array is now empty",
  }
  response.send(reply);
}


app.get('/blacklist/add/:host', addBlacklist);
app.get('/blacklist/remove/:host', removeBlacklist);
app.get('/blacklist/edit/:hosts', editBlacklist);
app.get('/blacklist/', getBlacklist);

function addBlacklist(request, response) {
  let host = request.params.host;

  if (!(modifiedData.blacklist.includes(host))) {
    modifiedData.blacklist.push(host);
    console.log(modifiedData.blacklist);
    let data = JSON.stringify(modifiedData, null, 2);
    fs.writeFile('data.json', data, finished);
    function finished() { console.log(host, "added to blacklist"); }

    reply = {
      success: true,
      message: "host successfully added to blacklist",
      hostname: host
    }

    response.send(reply);
  }
  else {
    reply = {
      success: false,
      message: "host already in array, could not be added",
      hostname: host
    }
    response.send(reply);
  }
}

function removeBlacklist(request, response) {
  let host = request.params.host;

  if (modifiedData.blacklist.includes(host)) {
    let index = modifiedData.blacklist.indexOf(host);
    modifiedData.blacklist.splice(index, 1);

    let data = JSON.stringify(modifiedData, null, 2);
    fs.writeFile('data.json', data, finished);
    function finished() { console.log(host, "removed from blacklist"); }

    reply = {
      success: true,
      message: "hostname successfully removed from blacklist",
      hostname: host
    }

    response.send(reply);
  }
  else {
    reply = {
      success: false,
      message: "hostname not found in array",
      hostname: host
    }
    response.send(reply);
  }
}

function editBlacklist(request, response) {
  let hosts = request.params.hosts;
  console.log(hosts);
  modifiedData.blacklist = hosts.split(",");
  console.log(modifiedData.blacklist);
  let data = JSON.stringify(modifiedData, null, 2);
  fs.writeFile('data.json', data, finished);
  function finished() { console.log("blacklist edited"); }

  reply = {
    success: true,
    message: "blacklist successfully edited",
    blacklist: hosts
  }

  response.send(reply);
}

function getBlacklist(request, response) {
  response.send(modifiedData.blacklist);
}

app.get('/keys/get', getKeys);
app.get('/keys/update/:new', updateKeys);

function getKeys(request, response) {
  response.send(modifiedData.api_keys);
}

function updateKeys(request, response) {
  let keys = request.params.new.split(",");
  modifiedData.api_keys.Bing_Spell_Check_API_Key = keys[0];
  modifiedData.api_keys.ResponsiveVoice_API_Key = keys[1];

  let data = JSON.stringify(modifiedData, null, 2);
  fs.writeFile('data.json', data, finished);
  function finished() { console.log(word, "keys modified"); }

  reply = {
    success: true,
    message: "keys have been modified",
    new_keys: request.params.new
  }
  response.send(reply);
}


app.get('/reset', reset);

function reset(request, response) {
  modifiedData = defaults;

  let data = JSON.stringify(modifiedData, null, 2);
  fs.writeFile('data.json', data, finished);
  function finished() { console.log(word, "reset database"); }

  reply = {
    success: true,
    message: "database has been fully reset to defaults"
  }
  response.send(reply);
}
