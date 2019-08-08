var paper = window.paper
var graph = window.graph
var objects = window.objects;
var links = window.links;
var currentLink;


/**
 * This event fires if a link is double clicked.
 */
paper.on('link:pointerdblclick', function(linkView){
    var id = linkView.model.id;
    currentLink = links.find(x => x.id == id);
    $("#modal .modal-body").html(`<input onclick="addIF()" type="image" src="./src/if.png" />
    <input onclick="addInput()" type="image" src="./src/input.png" />
    <input onclick="addOutput()" type="image" src="./src/output.png" />
    <input onclick="addAssignment()" type="image" src="./src/assignment.png" />`);
    $('#modal').modal('show')
})


function addOutput(){
    $('#modal').modal('hide')
    var Parallelogram = getParallelogram();
    Parallelogram.attr('label/text',getWrapText("output"));
    Parallelogram.addTo(graph);
    addElement(currentLink,Parallelogram,"output");
}


function addInput(){
    $('#modal').modal('hide')
    var Parallelogram = getParallelogram();
    Parallelogram.attr('label/text',getWrapText("input"));
    Parallelogram.addTo(graph);
    addElement(currentLink,Parallelogram,"input");
}


function addAssignment(){
    $('#modal').modal('hide')
    var Rectangle = getRectangle();
    Rectangle.attr('label/text',getWrapText("Statement"));
    Rectangle.addTo(graph);
    addElement(currentLink,Rectangle,"assignment");
    // addElementIf(currentLink,Rectangle,"if");
}

function addIF(){
    $('#modal').modal('hide')
    var diamond = getDiamond();
    diamond.attr('label/text',getWrapText("if"));
    diamond.addTo(graph);
    addElementIf(currentLink,diamond,"if");
}

