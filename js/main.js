var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: document.getElementById('myholder'),
    model: graph,
    width: 8000,
    height: 6000,
    gridSize: 1,
    interactive: function(cellView, method) {
        return cellView instanceof joint.dia.LinkView; // Only allow interaction with joint.dia.LinkView instances.
    }
});

var rect = new joint.shapes.standard.Rectangle();
rect.position(100, 30);
rect.resize(100, 40);
rect.attr({
    body: {
        fill: '#E74C3C',
        rx: 20,
        ry: 20,
        strokeWidth: 0
    },
    label: {
        text: 'Start',
        fill: '#ECF0F1'
    }
});


rect.addTo(graph);

var rect2 = rect.clone();
rect2.translate(0, 300);
rect2.attr('label/text', 'End');
rect2.addTo(graph);

var link = new joint.shapes.standard.Link();
link.source(rect);
link.target(rect2);
link.addTo(graph);





window.paper = paper;
window.graph = graph;

