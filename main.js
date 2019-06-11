// if (!('webkitSpeechRecognition' in window)) {
//   alert('get yourself a proper browser');
// }

// creates a SpeechRecognition object that we can operate on
window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
// recognition.continuous = true;

// TODO: update this comment - what does this code do?
recognition.interimResults = true;
const synth = window.speechSynthesis;

// creates an array to store all objections into. this will make it easier to reference the different objections later
var objections = new Array();

// declares an Objection Object that we can play with
var objection0 = new Object();
objection0.initialObjection = "sell me the sky";
objection0.pitchKeyword = "blue";
objection0.validPitchResponse = "good job";
objection0.badPitchResponse = "try again";

// store the new objection script 'objection1' into the array so we can use it later
objections[0] = objection0;

// keep track of WHICH objection the user is working with
// we can create objection2, etc, above to set-up multiple objection scripts (later, these will be in a DB)
var currentObjection = -1;

// temp note: changing variables from let to var to keep variable scope clean
// sets up the ability to hear the user through their microphone
const icon = document.querySelector('i.fa.fa-microphone')
var paragraph = document.createElement('p');
var container = document.querySelector('.text-box');
const sound = document.querySelector('.sound');
container.appendChild(paragraph);
var listening = false;
var question = false;

// when called, activates the SpeechRecognition object so it starts listening
recognition.onstart = function() {
  listening = true;
  console.log('Speech recognition service has started');
};

// when called, stops listening to the microphone
recognition.onend = function() {
  console.log('Speech recognition service disconnected');
};

// creats a variable that hears the user
const dictate = () => {
  console.log('dictating');

  // starts listening
  recognition.start();

  // stores the dictated audio into the 'result' variable
  recognition.onresult = (event) => {
    const speechToText = Array.from(event.results)
    .map(result => result[0])  // TODO: I'm not sure what this is doing since it is only looking at item 0 in the array - usually we would use a variable (like 'i') so the codes looks at every item in the array
    .map(result => result.transcript)
    .join('');
    
    // combines all of the things said into one block of text
    paragraph.textContent = speechToText;

    // adds a new visual elements to the screen
    if (event.results[0].isFinal) {
      container.scrollTo(0, container.scrollHeight);
      paragraph = document.createElement('p');
      container.appendChild(paragraph);

      // user initiates a random objection script
      if (speechToText.includes('give me any objection')) {
        // get a random objection based on the number of objections in the 'objections' object
        currentObjection = Math.floor(Math.random() * objections.length);
        // speak the objection to the user
        speak(getObjection(randomObjectionIndex));
        // capture the user's response
        dictate();
      };

      // user initiates 'objection1' objection script
      if (speechToText.includes('give me objection one')) {
        // establish that we are working with 'objection1'
        currentObjection = 0;
        // speak the objection to the user
        speak(getObjection(currentObjection));
        // capture the user's response
        dictate();
      };
      
      // conversation round 2
      if (speechToText.includes('response')) {
        //speak(scoreResponse);
        scoreResponse(speechToText)
      };
    }
  };

  recognition.onend = recognition.start
  // recognition.start();
};

// receives the index of an objection and returns the phrase to present the objection to the user
function getObjection(objectionIndex) {
  return objections[objectionIndex].initialObjection;
};


// round 2- Option A
const scoreResponse = () => {
  if (speechToText.includes(objections[currentObjection].pitchKeyword)) {
    return objections[currentObjection].validPitchResponse;
  } else {
    return objections[currentObjection].badPitchResponse;
  }
};


const speak = (action) => {
  utterThis = new SpeechSynthesisUtterance(action());
  setVoice(utterThis);
  synth.speak(utterThis);
};



// TODO: remove this old sample code if it isn't useful anymore

const stripUrl = (str) =>  {
  return str.match(/[a-z]+[:.].*?(?=\s)/);
}

icon.addEventListener('click', () => {
  if (listening) {
    recognition.stop();
    return;
  }
  sound.play();
  dictate();
});

function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  voices = speechSynthesis.getVoices();

  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById("voiceSelect").appendChild(option);
  }
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

const setVoice = (utterThis) => {
  const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  
};