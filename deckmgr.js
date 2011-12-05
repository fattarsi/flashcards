/*
 * deckmgr.js
 * Defines a Deck Manager class to manage decks of flashcards. The deckmgr holds references to decks
 * and holds the viewing preferences
 */

//deck constructor
function DeckMGR(key) {
    this.key = key;
    var d;
    //load saved state or set defaults
    if (localStorage[key]) {
        d = JSON.parse(localStorage[key]);
    } else {
        d = {};
        d.mode_animations = true;
    }
    //array to hold references to decks
    this.decks = (d.decks) ? d.decks : new Array();
    
    //index of active deck in decks array
    this.index = (d.index) ? d.index : 0;

    //view option settings
    this.mode_animations = (d.mode_animations) ? true : false;
    this.mode_reverse = (d.mode_reverse) ? true : false;
    
    this.current_deck = undefined;
    //set current deck, must be done last since it saves at end
    this.deck_load(this.index);
}

//return the active deck as a deck object
DeckMGR.prototype.active = function () {
    return this.current_deck;
}

//create a new deck to manage with name
//return index where it was added
DeckMGR.prototype.createDeck = function (name) {
    var key = 'deck-'+makeKey();
    var d = new Deck(key);
    d.name = name;
    d.save()
    this.deck_add(key);
    this.save();
    return this.decks.indexOf(key);
}

//add deck key to mgr
DeckMGR.prototype.deck_add = function (key) {
    this.decks.push(key)
}

//delete active deck and and cards in it
DeckMGR.prototype.deck_delete = function () {
    this.active().deleteAllCards();
    //rm deck
    localStorage.removeItem(this.active().key);
    this.decks.splice(this.index,1);
    this.deck_load(0);
    this.save();
}

//return deck object at given index
DeckMGR.prototype.deck_at_index = function (index) {
    if (index < 0 || index >= this.length()) {
        //index out of range, do nothing
        return null;
    }
    return new Deck(this.decks[index]);
}

//set active deck to deck at index
DeckMGR.prototype.deck_load = function (index) {
    if (index < 0 || index >= this.length()) {
        //index out of range, do nothing
        return;
    }
    this.index = index;
    this.current_deck = new Deck(this.decks[index]);
    this.save();
    
}

//return number of decks being managed
DeckMGR.prototype.length = function () {
    return this.decks.length;
}

//toggle the mode_animations option
DeckMGR.prototype.toggleAnimation = function () {
    this.mode_animations = (this.mode_animations) ? false : true;
    this.save();
}

//toggle the mode_reverse option
DeckMGR.prototype.toggleReverse = function () {
    this.mode_reverse = (this.mode_reverse) ? false : true;
    this.save();
}

//save the state of this object in localStorage
DeckMGR.prototype.save = function () {
    localStorage[this.key] = JSON.stringify(this,null,2);
}