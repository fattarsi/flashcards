/*
 * controller.js
 * Controls the state of the flashcard app using an instance of a Deck
 */

// Contoller globals
var DECK;

//check for proper html5 support
if (!Modernizr.localstorage) {
  setMsg('Your browser does not support cool features of HTML5 like localstorage, therefore cannot use this app.');
}

function initDeck() {
  var DECK = new Deck('deck');
  updateDisplay();
}

//show a message dialog
function setMsg(msg) {
  document.getElementById('msg').innerHTML = msg;
  hide('conf');
  show('msg-container');
}

function updateDisplay() {
    
}