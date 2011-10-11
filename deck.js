/*
 * deck.js
 * Defines a Deck class to represent a deck of flashcards. A deck holds references to
 * Card objects and viewing states
 */

//deck constructor
function Deck(key) {
    this.key = key;
    var d = (localStorage[key]) ? JSON.parse(localStorage[key]) : {} ;
    //this.index = (d.index) ? d.index : 0;
    this.index = 0;
    //master_set contains all cards in order that they were added
    this.master_set = (d.master_set) ? d.master_set : new Array();
    //this.cards = (d.cards) ? d.cards : new Array();
    //cards is the current ordering based on mutation options (random, low/high)
    this.cards = this.master_set.slice();
    this.mode_low = false;
    this.mode_high = false;
    this.mode_random = (d.mode_random) ? d.mode_random : false;
    this.mode_reverse = (d.mode_reverse) ? d.mode_reverse : false;
    
    this.processOptions();
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
    this.save();
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

//set the cards array based on mode_* options
Deck.prototype.processOptions = function () {
    //sanity check that both high and low are not set, if so set none
    if (this.mode_high && this.mode_low) {
        this.mode_high = this.mode_low = false;
    }
    
    this.cards = this.master_set.slice();
    
    if (this.mode_high || this.mode_low) {
        this.cards = new Array();
        for (var i=0; i<this.master_set.length; i++) {
            var c = new Card({'key':this.master_set[i]});
            if (this.mode_high && (c.points > 0)) {
                this.cards.push(c.key);
            } else if (this.mode_low && c.points <= 0) {
                this.cards.push(c.key);
            }
        }
        
        //if none were returned, turn option off and return master_set
        if (this.cards.length <= 0) {
            this.cards = this.master_set.slice();
            this.mode_high = false;
            this.mode_low = false;
        }
    }
    
    if (this.mode_random) {
        this.cards.sort(function() {return 0.5 - Math.random()});
    }
}

//save this deck in localstorage
Deck.prototype.save = function () {
    localStorage[this.key] = JSON.stringify(this,null,2);
}

//toggle the mode_high option
//setting high will unset low
Deck.prototype.toggleHigh = function () {
    this.mode_high = (this.mode_high) ? false : true;
    this.mode_low = (this.mode_high) ? false: this.mode_low;
    this.processOptions();
}

//toggle the mode_low option
//setting low will unset high
Deck.prototype.toggleLow = function () {
    this.mode_low = (this.mode_low) ? false : true;
    this.mode_high = (this.mode_low) ? false: this.mode_high;
    this.processOptions();
}

//toggle the mode_random option
Deck.prototype.toggleRandom = function () {
    this.mode_random = (this.mode_random) ? false : true;
    this.processOptions();
}

//toggle the mode_reverse option
Deck.prototype.toggleReverse = function () {
    this.mode_reverse = (this.mode_reverse) ? false : true;
    this.processOptions();
}

