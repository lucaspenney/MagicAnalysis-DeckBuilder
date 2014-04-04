function DeckManager() {
    this.loadedCards = 0;
    this.deckSize = null;
    this.deckId = null;
    this.loading = false;
    this.deckName = '';
}

DeckManager.prototype.loadDeck = function(id) {
    this.loading = true;
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
    var cards = [];
    Builder.layers.mainBoard.getChildren().each(function(node, index) {
        cards.push({
            id: node.cardData.id,
            sideboard: 0
        });
    });
    Builder.layers.sideBoard.getChildren().each(function(node, index) {
        cards.push({
            id: node.cardData.id,
            sideboard: 1
        });
    });

    var data = {
        id: this.deckId,
        name: $('#deckname').val(),
        cards: cards
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
    var img = new Image();
    img.src = "http://manastack.com/cards/images/" + cardData.set + "/" + cardData.num + ".jpg";
    img.onload = function() {
        var obj = new Kinetic.Image({
            x: 500,
            y: -100,
            opacity: 0.0,
            draggable: true,
            image: img,
            scale: 0.4
        });
        obj.cardData = cardData;

        if (sideboard === '1') {
            Builder.layers.sideBoard.add(obj);
        } else {
            Builder.layers.mainBoard.add(obj);
        }

        obj.tweens = cardTweens(obj);
        obj.hooks = cardHooks(obj);
        if (sideboard === '1') {
            obj.tweens.scaleSmall();
        } else {
            obj.tweens.scaleMedium();
        }

        Builder.sorter.applySort();
        _this.loadedCards++;
        if (_this.loadedCards >= _this.deckSize) {
            _this.loading = false;
            Builder.onDeckLoad();
        }
    };
};