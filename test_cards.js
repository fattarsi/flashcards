/*
 * test_card.js
 * Test for the Card class
 * Test case for Google-JS-Test http://code.google.com/p/google-js-test/
 * command: gjstest --js_files=card.js,test_cards.js,deck.js,test_deck.js
 */
 
 var localStorage = new Object();
 localStorage.removeItem = function (key) {
    delete this[key];
 }
 var c = new Card({'key':'cf'});
 c.phrase1 = 'Chris';
 c.phrase2 = 'Fattarsi';
 c.save();
  
 function CardTest() {}
 registerTestSuite(CardTest);
 
 CardTest.prototype.InitCard = function() {
  var card = new Card();
  //Assert new card fields are empty
  expectNe('', card.key);
  expectEq('', card.phrase1);
  expectEq('',card.phrase2);
  expectEq(0, card.points);
  
  var card = new Card({'key':'abcd'});
  expectEq('abcd', card.key);
  expectEq('', card.phrase1);
  expectEq('',card.phrase2);
  expectEq(0, card.points);
  
  var card = new Card({'key':'efg','phrase1':'hello','phrase2':'hola'});
  expectEq('efg', card.key);
  expectEq('hello', card.phrase1);
  expectEq('hola',card.phrase2);
  expectEq(0, card.points);
 }
  
CardTest.prototype.CardOps = function() {
  
  //open existing card, modify, save, and re-open
  var card = new Card({'key':'cf'});
  expectEq('cf', card.key);
  expectEq('Chris', card.phrase1);
  expectEq('Fattarsi',card.phrase2);
  expectEq(0, card.points);
  card.pointUp();
  expectEq(1, card.points);
  card.pointDown();
  card.pointDown();
  expectEq(-1, card.points);
  card.phrase1 = 'John';
  card.phrase2 = 'Doe';
  card.save();
  
  var card = new Card({'key':'cf'});
  expectEq('cf', card.key);
  expectEq('John', card.phrase1);
  expectEq('Doe',card.phrase2);
  expectEq(-1, card.points);
  
 }