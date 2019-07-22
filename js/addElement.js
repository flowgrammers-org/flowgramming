var paper = window.paper
var graph = window.graph
paper.on('link:pointerdblclick', function(linkView){
    var currentLink = linkView.model;

    var diamond = new joint.shapes.basic.Path({
        size: { width: 150, height: 50 },
        attrs: {
            path: { d: 'M 21 1 L 197 0 L 173 69 L 0 69 Z' }
        }
    });
    // diamond.position(200, 100)
    diamond.attr('label/text', 'Path');
    diamond.addTo(graph)
    var currentEnd = graph.getCell(currentLink.get('target').id);
    var currentStart = graph.getCell(currentLink.get('source').id);
    let startPosition = currentStart.position();
    // console.log(startPosition);
    diamond.position(startPosition.x-25,startPosition.y+100);
    currentLink.set({ target : diamond });
    var link = new joint.shapes.standard.Link();
    link.source(diamond);
    link.target(currentEnd);
    link.addTo(graph);


    $('#options').modal('show')

})