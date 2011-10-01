
if (Modernizr.localstorage) {
  var words = localStorage['words'];
} else {
  setMsg('Your browser does not support cool features of HTML5 like localstorage, therefore cannot use this app.')
}

function add() {
  hotkeyDisable();
  document.getElementById('button-save').onclick = save;
  hide('add-another');
  show('crud');
  document.getElementById('phrase-1').focus();
}

function cancel() {
  document.getElementById('phrase-1').value = '';
  document.getElementById('phrase-2').value = '';
  document.getElementById('crud').style.display = 'none';
  hotkeyEnable();
}

function closeAddAnother() {
  hide('add-another');
}

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
  show('conf');
}

function delNo() {
  setMsg('Delete canceled');
  hide('conf');
}

function delYes() {
  var key = CARDS[INDEX];
  localStorage.removeItem(key);
  CARDS.splice(INDEX,1);
  var current;
  //if random-mode also remove from proper list and update storage
  if (RANDOM) {
    current = CARDS.slice();
    CARDS = getCards();
    CARDS.splice(CARDS.indexOf(key), 1);
  }
  CARDS.save();
  
  //restore randomized array
  if (RANDOM) {
    CARDS = current.slice();
  }
  updateMain();
  hide('conf');
}

function edit() {
  hotkeyDisable();
  hide('add-another');
  document.getElementById('phrase-1').value = CARD['1'];
  document.getElementById('phrase-2').value = CARD['2'];
  document.getElementById('key').value = CARDS[INDEX];
  show('crud');
  document.getElementById('phrase-1').focus();
}

function flip() {
  toggle('main');
  toggle('main-alt');
}

function flipReset() {
  document.getElementById('main').style.display = '';
  document.getElementById('main-alt').style.display = 'none';
}

// Return card array from storage or a new empty one
function getCards() {
  var c = localStorage["cards"];
  var cards;
  if (c) {
    cards = JSON.parse(c);
  } else {
    cards = new Array();
  }
  
  cards.save = updateCards;
  return cards;
}

function help() {
  show('help');
}

function helpClose() {
  hide('help');
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

function initCards() {
  var c = localStorage["cards"];
  CARDS = getCards();
            
  if (c) {
      syncCards();
      updateStats();
      next();
  } else {
      //hide items not used when there are 0 cards (next,prev)
      navHide();
      
      // set help text for first run.
      setMsg('Click on messages to close.');
      document.getElementById('main').innerHTML = 'Click here to toggle card.';
      document.getElementById('main-alt').innerHTML = 'Now add some cards.';
      document.getElementById('button-add').focus();
  }
  
  //next();
}

function makeKey() {
    var text = "";
    var max = 3;
    var count = 0;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  do {
    text ="";
    count += 1;
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
  } while (localStorage[text] == undefined && count < max);
    return text;
}

function msgClose() {
  document.getElementById('msg-container').style.display = 'none';
}

function navShow(){
  show('button-next');
  show('button-prev');
  show('meter');
  show('options');
  show('points');
  show('stats');
}

function navHide() {
  hide('add-another');
  hide('button-next');
  hide('button-prev');
  hide('meter');
  hide('options');
  hide('stats');
  hide('points');
}

function next() {
  //reset main display
  flipReset();
  INDEX +=1;
  if (INDEX >= CARDS.length) {
    INDEX = 0;
  }

  updateMain();
}

function pointDown() {
  if (!CARD['points']) {
    CARD['points'] = -1;
  } else {
    CARD['points'] -= 1;
  }
  
  CARD.save();
  
  next();
}

function pointUp() {
  if (!CARD['points']) {
    CARD['points'] = 1;
  } else {
    CARD['points'] += 1;
  }
  
  CARD.save();
  
  next();
}

function prev() {
  flipReset();
  
  INDEX -= 1;
  if (INDEX < 0) {
    INDEX = CARDS.length - 1;
  }
  
  updateMain();
}

function reset() {
  document.getElementById('conf-msg').innerHTML = 'Are you sure you want to reset everything?';
  document.getElementById('conf-yes').onclick = resetYes;
  document.getElementById('conf-no').onclick = resetNo;
  show('conf');
  document.getElementById('conf-no').focus();
}

function resetYes() {
  localStorage.clear();
  setMsg('Reset settings');
  initCards();
  updateMain();
  hide('conf');
}

function resetNo() {
  setMsg('Reset canceled');
  hide('conf');
}

function save() {
  msgClose();
  var phrase1 = document.getElementById('phrase-1').value;
  var phrase2 = document.getElementById('phrase-2').value;
  
  if (!phrase1 || !phrase2) {
    setMsg('Both fields are required');
    return;
  }
  
  var card = new Object();
  
  card['1'] = phrase1;
  card['2'] = phrase2;
  card['points'] = 0;
  
  var key = document.getElementById('key').value;
  document.getElementById('key').value = '';
  
  var msg = "Card updated";
  
  // check if this is a new card
  if (!key) {
    key = makeKey();
    //in the event the array was randomized reload original array
    var current;
    if (RANDOM) {
      current = CARDS.slice();
      current.push(key);
      CARDS = getCards();
    }
    CARDS.push(key);
    CARDS.save();
    
    //but restore randomized array when done saving
    if (RANDOM) {
      CARDS = current.slice();
    }
    msg = "New card added";
  } else { //edit existing card
    //lookup point value on existing card
    card['points'] = JSON.parse(localStorage[key])['points'];
  }
  localStorage[key] = JSON.stringify(card,null,2);
  
  setMsg(msg);
  cancel();
  updateMain();
  show('add-another');
  document.getElementById('button-add-another').focus();
  hotkeyEnable();
}

function show(id) {
  document.getElementById(id).style.display = '';
}

function setMsg(msg) {
  document.getElementById('msg').innerHTML = msg;
  document.getElementById('msg-container').style.display = '';
}

function setStats(msg) {
  document.getElementById('stats').innerHTML = msg;
}

//iterates through all cards, removes any that do not exist in storage
function syncCards() {
  for (var i=0; i < CARDS.length; i++) {
    if (localStorage[CARDS[i]] == undefined) {
      CARDS.splice(i,1);
    }
  }
  CARDS.save();
}

function toggle(id) {
  if (document.getElementById(id).style.display == 'none') {
    document.getElementById(id).style.display = '';
  } else {
    document.getElementById(id).style.display = 'none';
  }
}

function toggleRandom() {
  if (RANDOM) {
    RANDOM = false;
    CARDS = JSON.parse(localStorage['cards']);
    document.getElementById('random').className = 'off';
  } else {
    RANDOM = true;
    CARDS.sort(function() {return 0.5 - Math.random()})
    document.getElementById('random').className = 'on';
  }
  
  updateMain();
}

function updateCard() {
  var s = JSON.stringify(CARD,null,2);
  localStorage[CARDS[INDEX]] = s;
}

function updateCards() {
  var s = JSON.stringify(CARDS,null,2);
  localStorage['cards'] = s;
  updateStats();
}

function updateMain() {
  if (INDEX < 0) {
    INDEX = 0;
  }
  
  if (INDEX >= CARDS.length) {
    INDEX = CARDS.length -1;
  }
  var c = localStorage[CARDS[INDEX]];
  if (!c) {
    //kills default text, any reason to blank out??
    //document.getElementById('main').innerHTML = '';
    //document.getElementById('main-alt').innerHTML = '';
    updateStats();
    return;
  }
  
  navShow();
  CARD = JSON.parse(localStorage[CARDS[INDEX]]);
  CARD.save = updateCard;

  document.getElementById('main').innerHTML = CARD['1'];
  document.getElementById('main-alt').innerHTML = CARD['2'];

  document.getElementById('meter').value = CARD['points'];
  document.getElementById('meter').innerHTML = CARD['points'];

  hide('meter');
  setTimeout("show('meter')", 1);
  
  updateStats();
}

function updateStats() {
  var msg;
  if (CARDS.length > 0) {
    msg = (INDEX+1) + ' / ' + CARDS.length;
  } else {
    msg = 'Cards: 0';
  }
  setStats(msg);
  
}
