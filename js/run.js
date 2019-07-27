var graph = window.graph;
var paper = window.paper;

var start = window.start;


function delay_loop(currentElement){
    var delay = 2000;
    let width = currentElement.attr("body/strokeWidth");
    currentElement.attr("body/strokeWidth",5);
    setTimeout(function() {
        currentElement.attr("body/strokeWidth",width);
        if(graph.getConnectedLinks(currentElement, { outbound: true }).length != 0){
            currentElement = getCell(graph.getConnectedLinks(currentElement, { outbound: true })[0].attributes.target);
            delay_loop(currentElement);
        }
    },delay);
}


function run(){
    var currentElement = start;
    delay_loop(currentElement);
}