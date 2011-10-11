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

//show add form
function add() {
  hotkeyDisable();
  document.getElementById('key').value = '';
  document.getElementById('button-save').onclick = save;
  resetDisplay();
  show('phrase-form');
  document.getElementById('phrase-1').focus();
}

//reset form fields
function cancel() {
  document.getElementById('phrase-1').value = '';
  document.getElementById('phrase-2').value = '';
  hotkeyEnable();
  resetDisplay();
  show('card-container');
  updateDisplay();
}

//do action for a given hotkey
function checkHotkey(e) {
  var key = (window.event) ? event : e;
  //alert(key.keyCode);
  switch(key.keyCode) {
    case 32:
      flip();
      break;
    case 37:
      prev();
      break;
    case 39:
      next();
      break;
    case 40:
    case 38:
      flip();
      break;
  }
}

function del() {
  document.getElementById('conf-msg').innerHTML = 'Are you sure you want to delete this card?';
  document.getElementById('conf-yes').onclick = delYes;
  document.getElementById('conf-no').onclick = delNo;
  hide('msg-container');
  show('conf');
}

function delNo() {
  setMsg('Delete canceled');
  hide('conf');
}

function delYes() {
    DECK.deleteCard();
    updateDisplay();
    hide('conf');
}

//set form to edit the current card
function edit() {
  var card = DECK.current();
  hotkeyDisable();
  resetDisplay();
  document.getElementById('phrase-1').value = card.phrase1;
  document.getElementById('phrase-2').value = card.phrase2;
  document.getElementById('key').value = card.key;
  show('phrase-form');
  document.getElementById('phrase-1').focus();
}

//display alternate phrase
function flip() {
    toggle('main');
    toggle('main-alt');
}

function flipReset() {
    if (DECK.mode_reverse) {
        document.getElementById('main').style.display = 'none';
        document.getElementById('main-alt').style.display = '';
    } else {
        document.getElementById('main').style.display = '';
        document.getElementById('main-alt').style.display = 'none';
    }
}

function hide(id) {
  document.getElementById(id).style.display = 'none';
}

function hotkeyDisable() {
  document.onkeydown = null;
}

function hotkeyEnable() {
  document.onkeydown = checkHotkey;
}

function initDeck() {
  DECK = new Deck('deck');
  //if deck is empty it could be first run or need to be migrated
  if (DECK.length() <= 0) {
    migrationCheck();
  }
  updateDisplay();
}

//migrate a previous schema to current if needed
function migrationCheck() {
    var c = localStorage["cards"];
    if (c) {
        var cards = JSON.parse(localStorage["cards"]);
        for (var ndx=0; ndx < cards.length; ndx++) {
            var oldCard = JSON.parse(localStorage[cards[ndx]]);
            var newCard = new Card({'phrase1':oldCard['1'], 'phrase2':oldCard['2'], 'points':oldCard['points']});
            newCard.save();
            DECK.add(newCard);
            localStorage.removeItem(cards[ndx]);
        }
        DECK.save();
        localStorage.removeItem("cards");
    }
}

function msgClose() {
  document.getElementById('msg-container').style.display = 'none';
}

function navShow(){
  show('bottom-panel');
  show('button-delete');
  show('button-edit');
  show('meter');
  show('options-container');
  show('stats');
}

function navHide() {
  hide('add-another');
  hide('bottom-panel');
  hide('button-delete');
  hide('button-edit');
  hide('meter');
  hide('options-container');
  hide('stats');
}

//display next card
function next() {
    DECK.next();
    updateDisplay();
}

//adjust point of card
function pointDown() {
    var card = DECK.current();
    card.pointDown();
    card.save();
    next();
}

function pointUp() {
    var card = DECK.current();
    card.pointUp();
    card.save();
    next();
}

//display previous card
function prev() {
    DECK.prev();
    updateDisplay();
}

function reset() {
  document.getElementById('conf-msg').innerHTML = 'Are you sure you want to reset everything?';
  document.getElementById('conf-yes').onclick = resetYes;
  document.getElementById('conf-no').onclick = resetNo;
  hide('msg-container');
  show('conf');
  document.getElementById('conf-no').focus();
}

//clear all blocks that may be showing in the main display
function resetDisplay() {
  hide('add-another');
  hide('card-container');
  hide('phrase-form');
}

function resetYes() {
  localStorage.clear();
  setMsg('Reset settings');
  initDeck();
  hide('conf');
}

function resetNo() {
  setMsg('Reset canceled');
  hide('conf');
}

function save() {
  var phrase1 = document.getElementById('phrase-1').value;
  var phrase2 = document.getElementById('phrase-2').value;
  
  if (!phrase1 || !phrase2) {
    setMsg('Both fields are required');
    return;
  }
  
  var key = document.getElementById('key').value;
  var card;
  var msg;
  //key is set -> edit
  if (key) {
    card = new Card({'key':key});
    card.phrase1 = phrase1;
    card.phrase2 = phrase2;
    card.save();
    msg = 'Card updated';
  } else {
    card = new Card({'phrase1':phrase1,'phrase2':phrase2});
    card.save();
    DECK.add(card);
    DECK.save();
    msg = 'Card added';
  }
  
  setMsg(msg);
  cancel();
  updateDisplay();
  resetDisplay();
  show('add-another');
  document.getElementById('button-add-another').focus();
  hotkeyEnable();
}

function show(id) {
  document.getElementById(id).style.display = '';
}

//show a message dialog
function setMsg(msg) {
  document.getElementById('msg').innerHTML = msg;
  hide('conf');
  show('msg-container');
}

function setStats(msg) {
  document.getElementById('stats').innerHTML = msg;
}

//toggle visibility of an id
function toggle(id) {
  if (document.getElementById(id).style.display == 'none') {
    document.getElementById(id).style.display = '';
  } else {
    document.getElementById(id).style.display = 'none';
  }
}

function toggleOption(elm) {
    //find option and do work
    switch(elm.id) {
      case 'lows':
        DECK.toggleLow();
        break;
      case 'highs':
        DECK.toggleHigh();
        break;
      case 'random':
        DECK.toggleRandom();
        break;
      case 'reverse':
        DECK.toggleReverse();
        break;
    }
  updateDisplay();
}

//show/hide the options
function toggleOptionsShow() {
  toggle('options');
  //change container class to show state
  var elm = document.getElementById('options-container');
  if (elm.className == 'on') {
    elm.className = 'off';
  } else {
    elm.className = 'on';
  }
}

//set display for the current card
function updateDisplay() {
    flipReset();
    hide('conf');
    var card = DECK.current();
    if (!card) {
        // set help text for first run.
        navHide();
        setMsg('Click on messages to close.');
        document.getElementById('main').innerHTML = 'Click here to toggle';
        document.getElementById('main-alt').innerHTML = 'Now add some';
        document.getElementById('button-add').focus();
        show('card-container');
    } else {
        navShow();
        document.getElementById('main').innerHTML = card.phrase1;
        document.getElementById('main-alt').innerHTML = card.phrase2;
        document.getElementById('meter').innerHTML = card.points;
        document.getElementById('key').value = card.key;
        
        setStats((DECK.index+1) + ' / ' + DECK.length());
    }
    
    updateOptions();
    
}

//update the state of the options to show current state
function updateOptions() {
    document.getElementById('highs').className = (DECK.mode_high) ? 'on' : 'off';
    document.getElementById('lows').className = (DECK.mode_low) ? 'on' : 'off';
    document.getElementById('random').className = (DECK.mode_random) ? 'on' : 'off';
    document.getElementById('reverse').className = (DECK.mode_reverse) ? 'on' : 'off';
}