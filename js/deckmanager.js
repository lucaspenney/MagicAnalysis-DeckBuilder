function DeckManager() {
    this.loadedCards = 0;
    this.deckSize = null;
    this.deckId = null;
    this.loaded = false;
    this.deckName = '';
    this.onSetsLoaded = function(){};
    var that = this;
    $.get("/api/formats", function(data) {
        for (var i=0;i<data.length;i++) {
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
        if (data.published) {
            $("#deckpublish").prop('checked', true);
        }
        var that = this;
        if (data.format) {
            that.onSetsLoaded = function() {
                $("#deckformat option").each(function() {
                    if ($(this).val() == data.format.id) $(this).prop('selected', true);
                    console.log($(this).val());
                    console.log(data.format.id);
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
    var published = $("#deckpublish").prop('checked');
    if (deck.length < 40 || !published) {
        published = false;
        $("#deckpublish").prop('checked', false);
    }
    var data = {
        id: this.deckId,
        name: $('#deckname').val(),
        description: $("#deckdescription").val(),
        publish: published,
        format: $("#deckformat").val(),
        cards: deck
    };
    $.post("/api/deck", data, function() {
        console.log("Saved deck");
        Builder.deckManager.getDeckList();
    });
}, 250);

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
        var line = '';
        data = data.grouped;
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                if (data[prop][0] === undefined) continue;
                line = "<div class='half pull-left'><h3>" + prop + "</h3>";
                for (var i=0;i<data[prop].length;i++) {
                    line += "<a class='cardlink' data-cardset='" + JSON.stringify(data[prop][i].set) + "' data-cardnum='" + data[prop][i].num + "'>" +
                    data[prop][i].count + " " + data[prop][i].name + "</a><br>";
                }
                line += "</div>";
            }
            html += line
;        }
        $("#decklist").html(html);
    });
}, 500);