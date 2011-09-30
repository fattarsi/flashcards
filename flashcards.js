
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
    case 65:
    case 97:
      add();
      break;
    case 68:
      del();
      break;
    case 69:
      edit();
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
  localStorage.removeItem(CARDS[INDEX]);
  CARDS.splice(INDEX,1);
  CARDS.save();
  updateMain();
  hide('conf');
}

function edit() {
  hotkeyDisable();
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
            
  if (c) {
      CARDS = JSON.parse(c);
      CARDS.save = updateCards;
      updateStats();
  } else {
      CARDS = new Array();
      CARDS.save = updateCards;
      setMsg('No cards. Add some.');
      document.getElementById('button-add').focus();
  }
  
  next();
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

function next() {
  //reset main display
  flipReset();
  
  if (RANDOM) {
    var prev = INDEX;
    var count = 0;
    var max = 3;
    do {
      count += 1;
      INDEX = Math.floor(Math.random() * CARDS.length);
    } while (CARDS.length > 1 && prev == INDEX && count < max);
  } else {
  
    INDEX +=1;
    if (INDEX >= CARDS.length) {
      INDEX = 0;
    }
  
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
}

function resetYes() {
  localStorage.clear();
  setMsg('Reset settings');
  initCards();
  //updateMain();
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
  
  if (!key) {
    key = makeKey();
    CARDS.push(key);
    CARDS.save();
    msg = "New card added";
  }
  localStorage[key] = JSON.stringify(card,null,2);
  
  setMsg(msg);
  cancel();
  updateMain();
  show('add-another');
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

function toggle(id) {
  if (document.getElementById(id).style.display == 'none') {
    document.getElementById(id).style.display = '';
  } else {
    document.getElementById(id).style.display = 'none';
  }
}

function toggleRandom() {
  if (document.getElementById('random').innerHTML =='off') {
    RANDOM = true;
    document.getElementById('random').innerHTML ='on';
    document.getElementById('random').style.background = '#f00';
  } else {
    RANDOM = false;
    document.getElementById('random').innerHTML ='off';
    document.getElementById('random').style.background = '#fff';
  }
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
    document.getElementById('main').innerHTML = '';
    document.getElementById('main-alt').innerHTML = '';
    updateStats();
    return;
  }
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
