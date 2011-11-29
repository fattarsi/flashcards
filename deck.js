/*
 * deck.js
 * Defines a Deck class to represent a deck of flashcards. A deck holds references to
 * Card objects and viewing states
 */

//deck constructor
function Deck(key) {
    this.key = key;
    var d;
    //load saved state or set defaults
    if (localStorage[key]) {
        d = JSON.parse(localStorage[key]);
    } else {
        d = {};
    }
    this.name = (d.name) ? d.name : this.key;
    //this.index = (d.index) ? d.index : 0;
    this.index = 0;
    //master_set contains all cards in order that they were added
    //this might get deprecated, might just use a single list
    this.master_set = (d.master_set) ? d.master_set : new Array();
    //cards is the current ordering based on mutation options, like shuffle
    this.cards = this.master_set.slice();

}

//add card to back of deck
Deck.prototype.add = function (card) {
    this.master_set.push(card.key);
    this.cards.push(card.key);
}

//return current card in deck
Deck.prototype.current = function () {
    //if no cards in deck
    if (this.length() <= 0) {
        return null;
    }
    
    //if index is out of range
    if (this.index < 0) {
        this.index = 0;
    }
    if (this.index >= this.length()) {
        this.index = this.length() -1;
    }
    
    return new Card({'key':this.currentKey()});
}

//return the storage key to the current card
Deck.prototype.currentKey = function () {
    return this.cards[this.index];
}

//delete all cards in deck
Deck.prototype.deleteAllCards = function () {
    while(this.length() > 0) {
        this.deleteCard();
        this.next();
    }
    
    this.save();
}

//delete the current card
Deck.prototype.deleteCard = function () {
    if (this.length() <= 0) {
        return;
    }
    //rm from storage
    localStorage.removeItem(this.currentKey());
    
    //rm from index arrays
    this.master_set.splice(this.master_set.indexOf(this.currentKey()),1);
    this.cards.splice(this.index, 1);
    
    //if any filter options are on, and the list is empty
    //restore master_set and clear options
    if (this.cards <= 0) {
        this.cards = this.master_set.slice();
    }
    this.save();
}

//return number of cards in deck
Deck.prototype.length = function  () {
    return this.cards.length;
}

//update index to next card
Deck.prototype.next = function () {
    this.index +=1;
    if (this.index >= this.length()) {
      this.index = 0;
    }
}

//update index to previous card
Deck.prototype.prev = function () {
    this.index -= 1;
    if (this.index < 0) {
      this.index = this.length() - 1;
    }
}

//mixes up order of cards
Deck.prototype.shuffle = function () {
    this.cards.sort(function() {return 0.5 - Math.random()});
}

//save this deck in localstorage
Deck.prototype.save = function () {
    localStorage[this.key] = JSON.stringify(this,null,2);
}



