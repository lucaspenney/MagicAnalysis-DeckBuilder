function DeckManager() {
    this.loadedCards = 0;
    this.deckSize = null;
    this.deckId = null;
    this.loaded = false;
    this.deckName = '';
    this.onSetsLoaded = function() {};
    var that = this;
    $.get("/api/formats", function(data) {
        for (var i = 0; i < data.length; i++) {
            $('#deckformat').append("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
        }
        that.onSetsLoaded();
    });
}

DeckManager.prototype.loadDeck = function(id) {
    this.deckId = id;
    var _this = this;
    $.get("/api/deck?id=" + id, function(data) {
        this.deckName = data.name;
        this.deckDescription = data.description;
        $('#deckname').val(this.deckName);
        $('#deckdescription').html(this.deckDescription);
        if (!data.published) {
            $("#deckprivate").prop('checked', true);
        }
        var that = this;
        if (data.format) {
            that.onSetsLoaded = function() {
                $("#deckformat option").each(function() {
                    if ($(this).val() == data.format.id) $(this).prop('selected', true);
                });
            };
            that.onSetsLoaded();
        }
        for (var i = 0; i < data.cards.length; i++) {
            _this.deckSize = data.cards.length;
            _this.createCard(data.cards[i].card, data.cards[i].sideboard);
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

    if (deck.length < 40) {
        $('#deckprivate').hide();
        $('#deckprivate input').prop('checked', false);
    } else {
        $('#deckprivate').show();
    }
    var deckprivate = $("#deckprivate input").prop('checked');
    if (!deckprivate) {
        deckprivate = false;
    } else {
        deckprivate = true;
    }

    var data = {
        id: this.deckId,
        name: $('#deckname').val(),
        description: $("#deckdescription").val(),
        deckprivate: deckprivate,
        format: $("#deckformat").val(),
        cards: deck
    };
    $.post("/api/deck/save/" + this.deckId, data, function() {
        console.log("Saved deck");
        Builder.deckManager.getDeckList();
    });
}, 250);

DeckManager.prototype.createCard = function(data, sideboard) {
    var cardData = data;
    var _this = this;
    var board = 1;
    if (sideboard == 1) board = 2;
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
        var line = '';
        data = data.grouped;
        for (var i = 0; i < data.length; i++) {
            if (data[i].name === undefined) continue;
            if (data[i].cards.length < 1) continue;
            line = "<div class='half pull-left'><h3>" + data[i].name + " (" + data[i].total + ")</h3>";
            for (var k = 0; k < data[i].cards.length; k++) {
                line += "<a class='cardlink' data-cardset='" + JSON.stringify(data[i].cards[k].set) + "' data-cardnum='" + data[i].cards[k].num + "'>" + data[i].cards[k].count + " " + data[i].cards[k].name + "</a><br>";
            }
            line += "</div>";
            html += line;
        }
        $("#decklist").html(html);
    });
}, 500);

DeckManager.prototype.addCardToDeck = function(card) {
    //See if this card should be added to the deck (number limits check)
    var allowedCards = ["Plains", "Island", "Mountain", "Swamp", "Forest", "Relentless Rats", "Shadowborn Apostle"];
    if (allowedCards.indexOf(card.cardData.name) === -1) {
        //Return false if there's 4 already in the deck
        var count = 0;
        for (var i = 0; i < Builder.cards.length; i++) {
            if (Builder.cards[i].cardData.name === card.cardData.name) count++;
            if (count > 4) return false;
        }
    }
    card.board = 1;
    Builder.sorter.applySort();
    return true;
};