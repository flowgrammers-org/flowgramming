var graph = new joint.dia.Graph;
var objects = [];
var links = [];
window.objects = objects;
window.links = links;



var paper = new joint.dia.Paper({
    el: document.getElementById('myholder'),
    model: graph,
    width: 800,
    height: 600,
    gridSize: 1,
    // interactive: function(cellView, method) {
    //     return cellView instanceof joint.dia.LinkView; // Only allow interaction with joint.dia.LinkView instances.
    // }
});

graph.on('change:position', function() {
    paper.fitToContent({
        padding: 20,
        minWidth: 800, // if you need it
        minHeight: 600, // if you need it
        gridWidth: 10,
        gridHeight: 10    
    });
})

var link = new joint.shapes.standard.Link();
var start = new joint.shapes.standard.Rectangle();
start.position(100, 30);
start.resize(150, 60);
start.attr({
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

objects.push({
    type : "start",
    model : start,
    id : start.id,
    outgoing_link : {
        next : link.id
    }
});
start.addTo(graph);

var end = start.clone();
end.attr('label/text', 'End');
objects.push({
    type : "end",
    model : end,
    id : end.id
});
end.translate(0, 100);
end.addTo(graph);


link.source(start);
link.target(end);
link.addTo(graph);

links.push({
    id : link.id,
    source : start.id,
    target : end.id,
    model : link
});

// var rect = start.clone();
// rect.position(150,700)
// rect.addTo(graph);

window.paper = paper;
window.graph = graph;
window.start = start;

