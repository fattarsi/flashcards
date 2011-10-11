/*
 * deck.js
 * Defines a Deck class to represent a deck of flashcards. A deck holds references to
 * Card objects and viewing states
 */

//deck constructor
function Deck(key) {
    this.key = key;
    var d = (localStorage[key]) ? JSON.parse(localStorage[key]) : {} ;
    this.index = (d.index) ? d.index : 0;
    this.cards = (d.cards) ? d.cards : new Array();
    this.mode_random = (d.mode_random) ? d.mode_random : false;
    this.mode_reverse = (d.mode_reverse) ? d.mode_reverse : false;
}

//add card to back of deck
Deck.prototype.add = function (card) {
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

//delete the current card
Deck.prototype.deleteCard = function () {
    if (this.length() <= 0) {
        return;
    }
    localStorage.removeItem(this.currentKey());
    this.cards.splice(this.index, 1);
}

//return number of cards in deck
Deck.prototype.length = function  () {
    return this.cards.length;
}

//return the next card and advance the index
Deck.prototype.next = function () {
  this.index +=1;
  if (this.index >= this.length()) {
    this.index = 0;
  }
  
  return this.current();
}

//return the previous card and update the index
Deck.prototype.prev = function () {
  this.index -= 1;
  if (this.index < 0) {
    this.index = this.length() - 1;
  }
  
  return this.current();
}

//save this deck in localstorage
Deck.prototype.save = function () {
  localStorage[this.key] = JSON.stringify(this,null,2);
}

