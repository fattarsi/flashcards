/*
 * test_deck.js
 * Test for the Deck class
 * Test case for Google-JS-Test http://code.google.com/p/google-js-test/
 * command: gjstest --js_files=card.js,test_cards.js,deck.js,test_deck.js
 */
 
 //var localStorage = new Object();
  
 function DeckTest() {}
 registerTestSuite(DeckTest);
 
 DeckTest.prototype.InitDeck = function() {
  var deck = new Deck('new-deck');
  expectEq(0, deck.length());
  expectFalse(deck.mode_random);
  expectFalse(deck.mode_reverse);

 }
 
 DeckTest.prototype.EdgeCases = function () {
    //return current card of empty deck
    var deck = new Deck('test-deck');
    var card = deck.current();
    expectEq(0, deck.length());
    expectEq(null, card);
    
    //delete from an empty deck
    deck.deleteCard();
    expectEq(0, deck.length());
 }
 
 DeckTest.prototype.DeckOperations = function() {
    var deck = new Deck('test-deck');
    
    expectEq(0,deck.length());
    
    //add a new card
    var card = new Card();
    card.phrase1 = 'Foo';
    card.phrase2 = 'Bar';
    card.save();
    deck.add(card);
    
    //add another
    var card = new Card();
    card.phrase1 = 'Foo2';
    card.phrase2 = 'Bar2';
    card.save();   
    deck.add(card);
    
    expectEq(2, deck.length());
    deck.save();
    
    //re-init the deck from storage
    var deck = new Deck('test-deck');
    expectEq(2, deck.length());
    
    //verify first card
    var card = deck.current();
    expectEq('Foo', card.phrase1);
    expectEq('Bar', card.phrase2);
    
    //verify second card
    deck.next();
    var card = deck.current();
    expectEq('Foo2', card.phrase1);
    expectEq('Bar2', card.phrase2);
    
    //back to first card
    deck.next();
    var card = deck.current();    
    expectEq('Foo', card.phrase1);
    expectEq('Bar', card.phrase2);
    
    //and back again
    deck.prev();
    var card = deck.current();
    expectEq('Foo2', card.phrase1);
    expectEq('Bar2', card.phrase2);
    
    //delete and verify back to 1 card
    deck.deleteCard();
    expectEq(1, deck.length());
    
    //verify only card left
    var card = deck.current();
    expectEq('Foo', card.phrase1);
    expectEq('Bar', card.phrase2);    
 }
 
 DeckTest.prototype.DeckOptions = function() {
    var deck = new Deck('test-deck-2');
    
    //if deck is empty, cannot toggleoptions
    expectEq(0,deck.length());
    deck.mode_high = false;
    deck.toggleHigh();
    expectFalse(deck.mode_high);
    
    //add 2 cards with negative points
    var card = new Card({'points':-5});
    card.save();
    deck.add(card);
    card = new Card({'points':-7});
    card.save()
    deck.add(card);
    expectEq(-5, deck.current().points);
    expectEq(2, deck.length());
    
    //verfy toggleHigh cannot be set
    expectFalse(deck.mode_high);
    deck.toggleHigh();
    expectFalse(deck.mode_high);
    
    //verify toggleLow can be set
    expectFalse(deck.mode_low);
    deck.toggleLow();
    expectTrue(deck.mode_low);
    
    //add card with positive points
    card = new Card({'points':10});
    card.save();
    deck.add(card);
    expectEq(3, deck.length());
    
    //toggleHigh, verify results
    deck.toggleHigh();
    expectTrue(deck.mode_high);
    expectEq(1, deck.length());
    expectEq(10, deck.current().points);
    deck.next();
    expectEq(1, deck.length());
    expectEq(10, deck.current().points);
    deck.toggleHigh();
    expectFalse(deck.mode_high);
    expectEq(3, deck.length());
    deck.toggleHigh();
    expectTrue(deck.mode_high);
    deck.deleteCard();
    expectFalse(deck.mode_high);
    expectEq(2, deck.length());
    
    
    
 }
 