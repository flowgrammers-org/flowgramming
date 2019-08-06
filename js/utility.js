var graph = window.graph;
var paper = window.paper;
var objects = window.objects;
var links = window.links;


function getParallelogram(){
    var parallelogram = new joint.shapes.standard.Path();
    parallelogram.resize(150, 75);
    parallelogram.attr('root/title', 'joint.shapes.standard.Path');
    parallelogram.attr('body/refD', 'M 21 1 L 197 0 L 173 69 L 0 69 Z');
    return parallelogram;
}


function getRectangle(){
    var rect = new joint.shapes.standard.Rectangle();
    rect.resize(150,75);
    return rect;
}

function getWrapText(text){
    var wraptext = joint.util.breakText(text, {
        width: 120,
        height: 70
    },{ ellipsis: true });
    // console.log(wraptext)
    return wraptext;
}


// function getDeclare(){
//     var rect = new joint.shapes.standard.
// }




function addElement(currentLink,element,type){
    var currentEnd =  findObject(currentLink.target)
    var currentStart = findObject(currentLink.source).model
    let startPosition = currentStart.position();
    element.position(startPosition.x,startPosition.y+100);
    currentLink.model.set({ target : element });
    currentLink.target = element.id;
    var link = new joint.shapes.standard.Link();
    objects.push({
        type : type,
        model : element,
        id : element.id,
        outgoing_link : {
           next :  link.id
        }
    });
    link.source(element);
    link.target(currentEnd.model);
    link.addTo(graph);

    links.push({
        id : link.id,
        target : currentEnd.id,
        source : element.id,
        model : link
    });
    var nextElement = currentEnd;
    while(nextElement){
        nextElement.model.translate(0,100);
        if(nextElement.outgoing_link){
            nextElement = findObject(findLink(nextElement.outgoing_link.next).target)
        }else{
            nextElement = null;
        }
    }
}


function findObject(id){
    return objects.find(x => x.id == id);
}

function findLink(id){
    return links.find(x => x.id == id);
}

function getCell(element){
    return graph.getCell(element.id)
}

