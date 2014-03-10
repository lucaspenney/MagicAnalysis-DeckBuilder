function Grapher() {

}

Grapher.prototype.load = function() {
    //Let's make some graphs. 
    //Graphs created by jqPlot
    var costGraph = $.jqplot('graphs', [
        [3, 7, 9, 1, 4, 6, 8]
    ], {
        title: 'Mana Cost Distribution',
        axesDefaults: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        },
        axes: {
            xaxis: {
                label: "Mana Cost",
            },
            yaxis: {
                label: "Cards"
            }
        }
    });

};