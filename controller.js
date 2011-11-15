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
  hide('option-container');
  hotkeyDisable();
  document.getElementById('key').value = '';
  //document.getElementById('button-save').onclick = save;
  resetDisplay();
  show('modal-container');
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
  hide('option-container');
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
  optionsClose();
  show('conf');
}

function delNo() {
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
    if (DECK.mode_animations) {
        if (document.getElementById('main').style.display == 'none') {
            $('#main-alt').toggle("slide", { direction: "down" }, 300);
            setTimeout("$('#main').toggle('slide', {direction: 'up'}, 300)",300);      
        } else {
            $('#main').toggle("slide", { direction: "up" }, 300);
            setTimeout("$('#main-alt').toggle('slide', {direction: 'down'}, 300)",300);
        }
    } else {
        toggle('main');
        toggle('main-alt');
    }
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
    if (DECK.mode_animations) {
        $('#main').hide("slide", { direction: "left" }, 300);
    } else {
        hide('main');
    }
    updateDisplay();
}

//hide edit/del options
function optionHide() {
    hide('option-del');
    hide('option-edit');
}

//show edit/del options
function optionShow() {
    show('option-del');
    show('option-edit');
}

function options() {
    show('modal-container');
    show('option-container');
    hide('phrase-form');
}

function optionsClose() {
    cancel();
    hide('modal-container');
    hide('phrase-form');
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
    if (DECK.mode_animations) {
        $('#main').hide("slide", { direction: "right" }, 200);
    } else {
        hide('main');
    }
    
    updateDisplay({'direction':'left'});
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
  hide('option-container');
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
  var msg = '';
  //key is set -> edit
  if (key) {
    card = new Card({'key':key});
    card.phrase1 = phrase1;
    card.phrase2 = phrase2;
    card.save();
    //msg = 'Card updated';
  } else {
    card = new Card({'phrase1':phrase1,'phrase2':phrase2});
    card.save();
    DECK.add(card);
    DECK.save();
    msg = 'Click options to add / edit / delete cards';
  }
  
  setMsg(msg);
  cancel();
  updateDisplay();
  resetDisplay();
  show('add-another');
  document.getElementById('button-add-another').focus();
  hotkeyEnable();
  setTimeout("msgClose()", 5000);
}

function show(id) {
  document.getElementById(id).style.display = '';
}

//shuffles the deck
function shuffle() {
    DECK.shuffle();
    updateDisplay();
}

//show a message dialog
function setMsg(msg, handler) {
  var elm = document.getElementById('msg')
  if (handler) {
    elm.onclick = handler;
  } else {
    elm.onclick = function () {msgClose();};
  }
  elm.innerHTML = msg;
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
      case 'option-animation-box':
        DECK.toggleAnimation();
        break;
      case 'option-reverse-box':
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
function updateDisplay(opts) {
    if (opts == undefined) {
        opts = {'direction':'right'};
    }
    flipReset();
    hide('conf');
    var card = DECK.current();
    if (!card) {
        // set help text for first run.
        //navHide();
        //hide edit/del options when there are 0 cards
        setMsg('click here to add your first card', function () {add();});
        optionHide();
        document.getElementById('main').innerHTML = 'Click here to toggle';
        document.getElementById('main-alt').innerHTML = 'Now add some';
        //document.getElementById('button-add').focus();
        show('card-container');
    } else {
        //navShow();
        optionShow();
        document.getElementById('main').innerHTML = card.phrase1;
        document.getElementById('main-alt').innerHTML = card.phrase2;
        //document.getElementById('meter').innerHTML = card.points;
        document.getElementById('key').value = card.key;
        
        setStats((DECK.index+1) + ' / ' + DECK.length());
    }
    
    if (DECK.mode_reverse) {
        if (DECK.mode_animations) {
            $('#main-alt').show("slide", { direction: opts['direction'] }, 200);
        } else {
            show('main-alt');
        }
        
    } else {
        if (DECK.mode_animations) {
            $('#main').show("slide", { direction: opts['direction'] }, 200);
        } else {
            show('main');
        }
    }
    
    updateOptions();
    
}

//update the state of the options to show current state
function updateOptions() {
    document.getElementById('option-animation-box').checked = DECK.mode_animations;
    document.getElementById('option-reverse-box').checked = DECK.mode_reverse;
}