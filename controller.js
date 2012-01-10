/*
 * controller.js
 * Controls the state of the flashcard app using an instance of a Deck
 * requires makeKey() function defined in cards.js
 */

// Contoller globals
var DECKMGR;

//check for proper html5 support
if (!Modernizr.localstorage) {
  setMsg('Your browser does not support cool features of HTML5 like localstorage, therefore cannot use this app.');
}

// only get URL when necessary in case BlobBuilder.js hasn't defined it yet
get_blob_builder = function() {
    return document.BlobBuilder || document.WebKitBlobBuilder || document.MozBlobBuilder;
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

//return a html option node
function createOptionNode(value, text, is_selected) {
    var opt = document.createElement('option');
    opt.setAttribute('value', value);
    if (is_selected) {
        opt.setAttribute('selected', 'selected');
    }
    opt.appendChild(document.createTextNode(text));
    return opt;
}

//show conf screen for deleting a deck
function deckDelete() {
    hide('deck-choices');
    document.getElementById('deck-delete-name').innerHTML = DECKMGR.active().name;
    document.getElementById('deck-delete-count').innerHTML = DECKMGR.active().length();
    show('deck-delete-conf');
}

//generate drop down list for decks
function deckListCreate() {
    var elm = document.getElementById('deck-list');
    //clear previous entries
    elm.innerHTML = '';
    //static entries
    elm.appendChild(createOptionNode('add', 'Add new'));
    elm.appendChild(createOptionNode('', '----------------'));
    
    //dynamic entries
    for (var i=0 ; i<DECKMGR.length() ; i++) {
        var d = DECKMGR.deck_at_index(i);
        elm.appendChild(createOptionNode(i, d.name+' ('+d.length()+')', (d.key == DECKMGR.active().key)));
    }
}

//show option form for current deck
function deckRename() {
    hide('deck-choices');
    show('deck-form');
    document.getElementById('deck-form-value').focus();
}

//a deck was selected from the dropdown
//do add operation if value='add' was passed
//do nothing if value is blank or current deck is already selected
function deckSelect(value) {
    var current = 'default';
    hide('deck-form');
    switch(value) {
        case '':
        case current:
            //do nothing
            return;
            break;
        case 'add':
            //add operation
            document.getElementById('deck-key').value = '';
            document.getElementById('deck-form-value').value = '';
            hide('deck-choices');
            show('deck-form');
            document.getElementById('deck-form-value').focus();
            break;
        default:
            DECKMGR.deck_load(value);
            updateDisplay();
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

//delete active deck and all cards
function delDeckYes() {
    DECKMGR.deck_delete();
    if (DECKMGR.length() <= 0) {
        init();
    }
    saveDeckCancel();
    updateDisplay();
}

function delNo() {
  hide('conf');
}

function delYes() {
    DECKMGR.active().deleteCard();
    updateDisplay();
    hide('conf');
}

//set form to edit the current card
function edit() {
  var card = DECKMGR.active().current();
  hotkeyDisable();
  resetDisplay();
  document.getElementById('phrase-1').value = card.phrase1;
  document.getElementById('phrase-2').value = card.phrase2;
  document.getElementById('key').value = card.key;
  show('phrase-form');
  document.getElementById('phrase-1').focus();
}

function export_csv() {
    var d = window.open('', 'export '+DECKMGR.active().name);
    d.document.open('text/csv');
    d.document.write('<html><textarea style="margin-top: 2px; margin-bottom: 2px; height: 287px; margin-left: 2px; margin-right: 2px; width: 462px; ">');
    for (var i=0 ; i<DECKMGR.active().length() ; i++) {
        var c = DECKMGR.active().current();
        d.document.write('"'+escape(c.phrase1)+'","'+escape(c.phrase2)+'"\n');
        DECKMGR.active().next();
    }
    d.document.write('</textarea></html>');
    d.document.close();
    return true;
}

//generate and prompt browser to download a .csv of
//current deck of cards
function eximExport() {
    var bb = new BlobBuilder;
    bb.append("Hello, world!");
    saveAs(bb.getBlob("text/plain;charset=utf-8"), "hello world.txt");
}

function eximImport() {
    hide('exim-button-container');
    show('exim-import-container');
}

// cancel file import
function eximImportCancel() {
    hide('exim-import-container');
    show('exim-button-container');
}

//display alternate phrase
function flip() {
    if (DECKMGR.mode_animations) {
        hotkeyDisable()
        if (document.getElementById('main').style.display == 'none') {
            $('#main-alt').toggle("slide", { direction: "down" }, 300);
            setTimeout("$('#main').toggle('slide', {direction: 'up'}, 300)",300);      
        } else {
            $('#main').toggle("slide", { direction: "up" }, 300);
            setTimeout("$('#main-alt').toggle('slide', {direction: 'down'}, 300)",300);
        }
        setTimeout('hotkeyEnable()', 300);
    } else {
        toggle('main');
        toggle('main-alt');
    }
}

function flipReset() {
    if (DECKMGR.mode_reverse) {
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

function init() {
  DECKMGR = new DeckMGR('deckmgr');
  //if deckmgr is empty it could be first run or need to be migrated
  if (DECKMGR.length() <= 0) {
    migrationCheck();
    //if still empty, add a default deck
    if (DECKMGR.length() <= 0) {
        var ndx = DECKMGR.createDeck('default');
        DECKMGR.deck_load(ndx);
    }
  }
  updateDisplay();
}

//return false if id is display:none
function isVisible(id) {
    return document.getElementById(id).style.display != 'none';
}

//migrate a previous schema to current if needed
function migrationCheck() {
    
    //prior to OO design
    var c = localStorage["cards"];
    if (c) {
        var deck = new Deck('deck');
        var cards = JSON.parse(localStorage["cards"]);
        for (var ndx=0; ndx < cards.length; ndx++) {
            var oldCard = JSON.parse(localStorage[cards[ndx]]);
            var newCard = new Card({'phrase1':oldCard['1'], 'phrase2':oldCard['2'], 'points':oldCard['points']});
            newCard.save();
            deck.add(newCard);
            localStorage.removeItem(cards[ndx]);
        }
        deck.save();
        localStorage.removeItem("cards");
    }
    
    //migrate to DeckMGR >= 0.6.2
    var deck = localStorage['deck'];
    if (deck) {
        DECKMGR = new DeckMGR('deckmgr');
        
        //copy deck to new format
        var key = 'deck-'+makeKey();
        localStorage[key] = deck;
        
        //set the name
        var d = new Deck(key);
        d.name = 'default';
        d.save();
        
        //add to mgr and cleanup
        DECKMGR.deck_add(key);
        DECKMGR.deck_load(0);
        DECKMGR.save();
        localStorage.removeItem('deck');
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
    hotkeyDisable();
    DECKMGR.active().next();
    if (DECKMGR.mode_animations) {
        if (isVisible('main')) {
            $('#main').hide("slide", { direction: "left" }, 300, function () {updateDisplay()});
        } else {
            $('#main-alt').hide("slide", { direction: "left" }, 300, function () {updateDisplay()});
        }
    } else {
        hide('main');
        updateDisplay();
    }
    //updateDisplay();
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
    show('deck-choices');
}

function options() {
    hotkeyDisable();
    hide('phrase-form');
    hide('deck-delete-conf');
    deckListCreate();
    show('modal-container');
    show('option-container');
}

function optionsClose() {
    hotkeyEnable();
    cancel();
    hide('deck-form');
    hide('option-container');
    hide('phrase-form');
    hide('modal-container');
}

//adjust point of card
function pointDown() {
    var card = DECKMGR.active().current();
    card.pointDown();
    card.save();
    next();
}

function pointUp() {
    var card = DECKMGR.active().current();
    card.pointUp();
    card.save();
    next();
}

//display previous card
function prev() {
    hotkeyDisable();
    DECKMGR.active().prev();
    if (DECKMGR.mode_animations) {
        if (isVisible('main')) {
            $('#main').hide("slide", { direction: "right" }, 200, function () {updateDisplay({'direction':'left'})});
        } else {
            $('#main-alt').hide("slide", { direction: "right" }, 200, function () {updateDisplay({'direction':'left'})});
        }
    } else {
        hide('main');
        updateDisplay({'direction':'left'});
    }
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

// save card form
function save() {
  var phrase1 = document.getElementById('phrase-1').value;
  var phrase2 = document.getElementById('phrase-2').value;
  
  if (!phrase1 || !phrase2) {
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
    DECKMGR.active().add(card);
    DECKMGR.active().save();
  }
  
  cancel();
  updateDisplay();
  resetDisplay();
  show('add-another');
  document.getElementById('button-add-another').focus();
  hotkeyEnable();
  setTimeout("msgClose()", 5000);
}

//save deck
function saveDeck() {
    var name = document.getElementById('deck-form-value').value;
    if (!name) {
        return;
    }
    
    var index = document.getElementById('deck-key').value;
    
    var d;
    if (index) {
        //edit
        d = DECKMGR.deck_at_index(index);
        d.name = name;
        d.save();
    } else {
        //add new
        index = DECKMGR.createDeck(name);
    }
    
    //must load to update deckmgr instance
    DECKMGR.deck_load(index);
    
    //update list
    updateDisplay();
    saveDeckCancel();
}

//cancel save operation, redo display
function saveDeckCancel() {
    show('deck-choices');
    hide('deck-form');
    hide('deck-delete-conf');
}

function show(id) {
  document.getElementById(id).style.display = '';
}

//shuffles the deck
function shuffle() {
    DECKMGR.active().shuffle();
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
        DECKMGR.active().toggleLow();
        break;
      case 'highs':
        DECKMGR.active().toggleHigh();
        break;
      case 'option-animation':
        DECKMGR.toggleAnimation();
        break;
      case 'option-reverse':
        DECKMGR.toggleReverse();
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
    var card = DECKMGR.active().current();
    if (!card) {
        // set help text for first run.
        //navHide();
        //hide edit/del options when there are 0 cards
        setMsg('no cards in this deck, click here to add', function () {add();});
        optionHide();
        document.getElementById('main').innerHTML = 'Click here to toggle';
        document.getElementById('main-alt').innerHTML = 'Now add some';
        //document.getElementById('button-add').focus();
        setStats('0 cards');
        show('card-container');
    } else {
        //navShow();
        hide('msg-container');
        optionShow();
        document.getElementById('main').innerHTML = escape(card.phrase1);
        document.getElementById('main-alt').innerHTML = escape(card.phrase2);
        //document.getElementById('meter').innerHTML = card.points;
        document.getElementById('key').value = card.key;
        
        setStats((DECKMGR.active().index+1) + ' / ' + DECKMGR.active().length());
    }
    
    if (DECKMGR.mode_reverse) {
        if (DECKMGR.mode_animations) {
            $('#main-alt').show("slide", { direction: opts['direction'] }, 200);
        } else {
            show('main-alt');
        }
        
    } else {
        if (DECKMGR.mode_animations) {
            $('#main').show("slide", { direction: opts['direction'] }, 200);
        } else {
            show('main');
        }
    }
    
    updateOptions();
    hotkeyEnable();
}

//update the state of the options to show current state
function updateOptions() {
    deckListCreate();
    document.getElementById('deck-key').value = DECKMGR.index;
    document.getElementById('deck-form-value').value = DECKMGR.active().name;
    document.getElementById('option-animation').className = (DECKMGR.mode_animations) ? 'switch-on' : 'switch-off';
    document.getElementById('option-reverse').className = (DECKMGR.mode_reverse) ? 'switch-on' : 'switch-off';
}