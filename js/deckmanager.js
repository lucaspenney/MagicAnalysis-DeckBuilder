function DeckManager() {
    this.loadedCards = 0;
    this.deckSize = null;
    this.deckId = null;
    this.loaded = false;
    this.deckName = '';
}

DeckManager.prototype.loadDeck = function(id) {
    this.deckId = id;
    var _this = this;
    $.get("/api/deck?id=" + id, function(data) {
        this.deckName = data.name;
        $('#deckname').val(this.deckName);
        for (var i = 0; i < data.deck.length; i++) {
            _this.deckSize = data.deck.length;
            _this.createCard(data.deck[i].card, data.deck[i].sideboard);
        }
    });
};

DeckManager.prototype.saveDeck = debounce(function() {
    var deck = [];
    var cards = Builder.cards;
    for (var i = 0; i < cards.length; i++) {
        if (cards[i] === null) continue;
        if (!cards[i].mainboard || !cards[i].sideboard) continue;
        deck.push({
            id: cards[i].cardData.id,
            sideboard: cards[i].sideboard
        });
    }

    var data = {
        id: this.deckId,
        name: $('#deckname').val(),
        cards: deck
    };
    $.post("/api/deck", data, function() {

    });
}, 100);

function debounce(fn, delay) {
    var timer = null;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
};

DeckManager.prototype.createCard = function(data, sideboard) {
    var cardData = data;
    var _this = this;
    var board = 1;
    if (sideboard === '1') board = 2;
    new Card(data, board, function() {
        console.log(2);
        _this.loadedCards++;
        if (_this.loadedCards >= _this.deckSize) {
            _this.loaded = true;
            Builder.onDeckLoad();
        }
    });
};