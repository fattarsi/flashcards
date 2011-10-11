/*
 * test_deck.js
 * Test for the Deck class
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
    var card = deck.next();
    expectEq('Foo2', card.phrase1);
    expectEq('Bar2', card.phrase2);
    
    //back to first card
    var card = deck.next();
    expectEq('Foo', card.phrase1);
    expectEq('Bar', card.phrase2);
    
    //and back again
    var card = deck.prev();
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
 