var paper = window.paper
var graph = window.graph
var objects = window.objects;
var links = window.links;
var currentLink;

paper.on('link:pointerdblclick', function(linkView){
    var id = linkView.model.id;
    currentLink = links.find(x => x.id == id);
    $("#modal .modal-body").html(`<input onclick="addIF()" type="image" src="./src/1.png" />
	<input onclick="addInput()" type="image" src="./src/2.png" />
    <input onclick="addRect()" type="image" src="./src/3.png" />`);
    $('#modal').modal('show')
})


function addInput(){
    $('#modal').modal('hide')
    var Parallelogram = getParallelogram();
    Parallelogram.attr('label/text',getWrapText("input"));
    Parallelogram.addTo(graph);
    addElement(currentLink,Parallelogram);
}


function addRect(){
    $('#modal').modal('hide')
    var Rectangle = getRectangle();
    Rectangle.attr('label/text',getWrapText("Statement"));
    Rectangle.addTo(graph);
    addElement(currentLink,Rectangle);
}

function addIF(){
    $('#modal').modal('hide')

}

