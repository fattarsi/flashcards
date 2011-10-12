/*
 * card.js
 * Defines a Card class to represent a flashcard
 */


// Card constructor
function Card(opts) {
    if (opts == undefined) { opts = {} };
    this.key = (opts.key) ? opts.key : makeKey();
    //set attrs if key is in localStorage
    if (localStorage[this.key]) {
        var c = JSON.parse(localStorage[this.key]);
        this.phrase1 = c.phrase1;
        this.phrase2 = c.phrase2;
        this.points = c.points;
        return;
    }
    
    this.phrase1 = (opts.phrase1) ? opts.phrase1 : '';
    this.phrase2 = (opts.phrase2) ? opts.phrase2 : '';
    this.points = (opts.points) ? opts.points : 0;
}

Card.prototype.pointUp = function () {
    this.points +=1;
}

Card.prototype.pointDown = function () {
    this.points -=1;
}

// save this card in localStorage
Card.prototype.save = function () {
  //convert to js object to save space unless I can find a way to restore
  //in the constructure (i.e. this = JSON.parse..)
  var o = new Object();
  o.key = this.key;
  o.phrase1 = this.phrase1;
  o.phrase2 = this.phrase2;
  o.points = this.points;
  localStorage[this.key] = JSON.stringify(o,null,2);
}


// return a random string that is not currently used in localStorage as a key
function makeKey() {
    var text = "";
    var max = 10;
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