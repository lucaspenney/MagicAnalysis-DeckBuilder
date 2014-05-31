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
        this.deckDescription = data.description;
        $('#deckname').val(this.deckName);
        $('#deckdescription').html(this.deckDescription);
        for (var i = 0; i < data.deck.length; i++) {
            _this.deckSize = data.deck.length;
            _this.createCard(data.deck[i].card, data.deck[i].sideboard);
            Builder.deckManager.getDeckList();
        }
    });
};

$("#deckname").keyup(function(e) {
    Builder.deckManager.saveDeck();
});
$("#deckdescription").keyup(function(e) {
    Builder.deckManager.saveDeck();
});


DeckManager.prototype.saveDeck = debounce(function() {
    var deck = [];
    for (var i = 0; i < Builder.cards.length; i++) {
        if (Builder.cards[i] === null) continue;
        if (Builder.cards[i].board === 0) continue;
        var sideboard = 0;
        if (Builder.cards[i].board === 2) sideboard = 1;
        deck.push({
            id: Builder.cards[i].cardData.id,
            sideboard: sideboard
        });
    }

    var data = {
        id: this.deckId,
        name: $('#deckname').val(),
        description: $("#deckdescription").val(),
        cards: deck
    };
    $.post("/api/deck", data, function() {
        console.log("Saved deck");
        Builder.deckManager.getDeckList();
    });
}, 250);

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
        _this.loadedCards++;
        if (_this.loadedCards >= _this.deckSize) {
            _this.loaded = true;
            Builder.onDeckLoad();
        }
    });
};

DeckManager.prototype.getDeckList = debounce(function() {
    $.get("/api/deck/list?id=" + Builder.deckManager.deckId, function(data) {
        this.decklist = data.list;
        var html = '';
        var data = data.list;
        for (var i = 0; i < data.length; i++) {
            var line = '';
            line += data[i].count + ' ';
            line += data[i].cardname;
            line += "<br>";
            html += line;
        }
        $("#decklist").html(html);
    });
}, 500);