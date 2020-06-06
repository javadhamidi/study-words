/*
*/

let countArray = [null, null, null];

let sCorrect = new Howl({ src: ['res/audio/correct.mp3'] });
let sIncorrect = new Howl({ src: ['res/audio/incorrect.mp3'] });
let sNext = new Howl({ src: ['res/audio/next.mp3'] });

document.getElementsByClassName('text-input')[0].focus();

function updateCount() {
  let indicator;
  for (var i = 0; i < countArray.length; i++) {
    indicator = document.getElementsByClassName("si")[i];
    if (countArray[i] == true) { indicator.style.backgroundColor = "#48db6a" }
    if (countArray[i] == false) { indicator.style.backgroundColor = "#e52242" }
    if (countArray[i] == null) { indicator.style.backgroundColor = "#cccccc" }
  }
}

let practiceWords;

function start() {
  let currentWordIndex = 0; // use for deciding current streak
  let count = 0;

  responsiveVoice.speak("spell: " + Object.keys(practiceWords)[currentWordIndex]);

  document.getElementsByClassName('text-input')[0].onkeypress = function(event) {
    if (event.keyCode == '13' && document.getElementsByClassName('text-input')[0].value != "") {
     processInput(document.getElementsByClassName('text-input')[0].value);
     document.getElementsByClassName('text-input')[0].value = "";
    }
  }
  document.getElementsByClassName('submit-button')[0].addEventListener("click", function() {
    if (document.getElementsByClassName('text-input')[0].value != "") {
      processInput(document.getElementsByClassName('text-input')[0].value);
      document.getElementsByClassName('text-input')[0].value = "";
    }
  });

  document.getElementsByClassName('play-audio')[0].addEventListener("click", function() {
    responsiveVoice.speak(Object.keys(practiceWords)[currentWordIndex]);
  });

  document.getElementsByClassName('skip')[0].addEventListener("click", function() {
    currentWordIndex++;
    responsiveVoice.speak("spell: " + Object.keys(practiceWords)[currentWordIndex]);
  });

  function resetInputBox() {

  }

  function nextWordFeedback() {
    let inputBox = document.getElementsByClassName('text-input')[0];
    inputBox.disabled = true;
    inputBox.value = "rhythm";
    inputBox.style.color = "#3bbf59";
    //inputBox.style.backgroundColor = '#8cffa6'


    let inputButton = document.getElementsByClassName('submit-button')[0];
    inputButton.style.backgroundColor = '#48db6a'
  }
  //nextWordFeedback();

  function processInput(string) {
    let currentWord = Object.keys(practiceWords)[currentWordIndex];

    document.getElementsByClassName("count-text")[0].innerText = "Spell Correctly " + (3 - count) +" More Times";
    // if correct
    if (string == currentWord) {
      console.log("correct");
      if (count == 2) {
        count = 0;
        currentWordIndex++;
        document.body.classList.remove('correctOut');
        document.body.classList.add('correctIn');
        //document.body.style.backgroundColor = "#65ff81";
        countArray = [true, true, true];

        document.getElementsByClassName("instructions")[0].innerText = "Correct!";
        document.getElementsByClassName("instructions")[0].style.color = "#326e3c";
        document.getElementsByClassName("count-text")[0].innerText = "Click anywhere to continue";
        document.getElementsByClassName("count-text")[0].style.color = "#326e3c";
        document.getElementsByClassName("submit-button")[0].style.backgroundColor = "#48db6a";
        document.getElementsByClassName("text-input")[0].disabled = true;
        document.getElementsByClassName("streak")[0].innerText = "Streak: " + (currentWordIndex);

        //document.getElementsByClassName("text-input")[0].value = currentWord;

        sNext.play();

        function nextQuestion() {
          document.body.removeEventListener("click", nextQuestion, {once : true});
          document.body.removeEventListener("keydown", nextQuestion, {once : true});

          document.body.classList.remove('correctIn');
          document.body.classList.add('correctOut');
          countArray = [null, null, null];
          updateCount();
          responsiveVoice.speak("spell: " + Object.keys(practiceWords)[currentWordIndex]);

          document.getElementsByClassName("instructions")[0].innerText = "Type what you hear";
          document.getElementsByClassName("instructions")[0].style.color = "#2d2d2d";
          document.getElementsByClassName("count-text")[0].innerText = "Spell Correctly 3 More Times";
          document.getElementsByClassName("count-text")[0].style.color = "#2d2d2d";
          document.getElementsByClassName("submit-button")[0].style.backgroundColor = "#02bfff";
          document.getElementsByClassName("text-input")[0].disabled = false;
          document.getElementsByClassName('text-input')[0].focus();

          //document.getElementsByClassName("text-input")[0].value = '';

          if (typeof currentWord != string) {
            console.log('hi');
            window.onbeforeunload = null;
            window.location.href = window.location.href.replace("quiz.html", "complete.html?" + currentWordIndex);
            console.log(window.location.href);
          }
        }

        document.body.addEventListener("click", nextQuestion, {once : true});
        document.body.addEventListener("keydown", nextQuestion, {once : true});
        /*
        countArray = [true, true, true];
        document.getElementsByClassName("streak")[0].innerText = "Streak: " + (currentWordIndex);
        document.getElementsByClassName("instructions")[0].innerText = "Correct!";
        document.getElementsByClassName("instructions")[0].style.color = "#42b755";
        document.getElementsByClassName("count-text")[0].innerText = "Click anywhere to continue";
        document.getElementsByClassName("count-text")[0].style.color = "#3cc152";
        //countArray = [null, null, null];
        //responsiveVoice.speak("spell: " + Object.keys(practiceWords)[currentWordIndex]);
        */
      }
      else {
        count++;
        sCorrect.play();
        if (countArray.indexOf(null) != -1) {
          countArray[countArray.indexOf(null)] = true;
        } else {
          countArray.shift();
          countArray[countArray.length] = true;
        }

      }

    // if incorrect
    } else {
      count = 0;
      console.log("incorrect");
      sIncorrect.play();
      if (countArray.indexOf(null) != -1) {
        countArray[countArray.indexOf(null)] = false;
      } else {
        countArray.shift();
        countArray[countArray.length] = false;
      }
    }
    updateCount();
  }
}

window.onbeforeunload = function() {
    return 'Test not complete! Are you sure you want to leave?';
}

/*
let isFullScreen = false;

document.getElementsByClassName("fullscreen-toggle")[0].addEventListener("click", function () {
  if (isFullScreen == false) {
    document.documentElement.webkitRequestFullscreen();
    document.getElementsByClassName("fullscreen-indicator")[0].class = "fullscreen-indicator fas fa-compress"
  }
  else {
    document.documentElement.webkitExitFullscreen();
    document.getElementsByClassName("fullscreen-indicator")[0].class = "fullscreen-indicator fas fa-expand"
  }
});
*/
// hostname for Study Words database Server
const SWS_HOSTNAME = "http://localhost:3000";

let request = new XMLHttpRequest();

request.open("GET", SWS_HOSTNAME + "/all", true);  // true for asynchronous
request.send();

request.onreadystatechange = () => {
  // ensures function is only executed once (CORS sends multiple)
  if (request.readyState == 4 && request.status == 200) {
    practiceWords = JSON.parse(request.responseText);
    start()
    return;
  }
}
