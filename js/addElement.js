var paper = window.paper
var graph = window.graph
paper.on('link:pointerdblclick', function(linkView){
    var currentLink = linkView.model;
    currentLink.attr('line/stroke', 'orange')
    currentLink.label(0, {
        attrs: {
            body: {
                stroke: 'orange'
            }
        }
    })
})

// var polygon = new joint.shapes.standard.Polygon();
// polygon.resize(100, 100);
// polygon.position(250, 210);
// polygon.attr('root/title', 'joint.shapes.standard.Polygon');
// polygon.attr('label/text', 'Polygon');
// polygon.attr('body/refPoints', '0,10 10,0 20,10 10,20');
// polygon.addTo(graph);