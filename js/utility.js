var graph = window.graph;
var paper = window.paper;
var objects = window.objects;
var links = window.links;

/**
 * Returns a new parallelogram object 
 */
function getParallelogram() {
    var parallelogram = new joint.shapes.standard.Path();
    parallelogram.resize(150, 75);
    parallelogram.attr('root/title', 'joint.shapes.standard.Path');
    parallelogram.attr('body/refD', 'M 21 1 L 197 0 L 173 69 L 0 69 Z');
    return parallelogram;
}

/**
 * Returns a new diamond shaped object
 */
function getDiamond() {
    var diamond = new joint.shapes.standard.Path();
    diamond.resize(100, 100);
    diamond.attr('body/refD', 'M 30 0 L 60 30 30 60 0 30 Z');
    return diamond;
}

/**
 * Returns a new rectangle object
 */
function getRectangle() {
    var rect = new joint.shapes.standard.Rectangle();
    rect.resize(150, 75);
    return rect;
}

/**
 * Returns a wrapText, extra text is replaced by ellipsis(...)
 */

function getWrapText(text) {
    var wraptext = joint.util.breakText(text, {
        width: 120,
        height: 70
    }, { ellipsis: true });
    return wraptext;
}

/**
 * Adds the given element to the graph, used for declare,assignment,input,output
 * @param {"The link to add the element"} currentLink 
 * @param {"The element to add"} element 
 * @param {"Type of the element"} type 
 */
function addElement(currentLink, element, type) {
    let vertices = currentLink.model.vertices()
    if (currentLink.type == null) {
        var currentEnd = findObject(currentLink.target)
        var currentStart = findObject(currentLink.source).model
        let startPosition = currentStart.position();
        element.position(startPosition.x, startPosition.y + 100);
        currentLink.model.set({ target: element });
        currentLink.target = element.id;
        var link = new joint.shapes.standard.Link();
        objects.push({
            type: type,
            model: element,
            id: element.id,
            outgoing_link: {
                next: link.id
            }
        });
        link.source(element);
        link.target(currentEnd.model);
        link.addTo(graph);
        links.push({
            id: link.id,
            target: currentEnd.id,
            source: element.id,
            model: link
        });
        translateDown(currentEnd, null)
    }
    else if (currentLink.type == "if") {
        //Here there, are no elements inside the if, thus split into ifstart and ifend
        //This is to keep the array sorted
        if (vertices[0].y > vertices[1].y) {
            swap(vertices[0], vertices[1])
        }
        currentLink.type = "ifstart"
        var currentEnd = findObject(currentLink.target)
        var currentStart = findObject(currentLink.source).model
        let startPosition = currentStart.position();
        if (startPosition.x <= vertices[0].x) {
            startPosition.x += 125
        }
        else {
            startPosition.x -= 175
        }
        element.position(startPosition.x, startPosition.y + 100);
        currentLink.model.set({ target: element });
        currentLink.target = element.id;
        var link = new joint.shapes.standard.Link();
        link.vertices([{
            x: vertices[1].x,
            y: vertices[1].y + 100
        }])
        objects.push({
            type: type,
            model: element,
            id: element.id,
            outgoing_link: {
                next: link.id
            }
        });
        link.source(element);
        link.target(currentEnd.model);
        link.addTo(graph);
        links.push({
            id: link.id,
            target: currentEnd.id,
            source: element.id,
            model: link,
            type: "ifend"
        });
        currentLink.model.vertices([vertices[0]])
        translateDown(currentEnd, null)

    } else if (currentLink.type == "ifstart") {
        var currentEnd = findObject(currentLink.target)
        var currentStart = findObject(currentLink.source).model
        let startPosition = currentStart.position();
        if (startPosition.x <= vertices[0].x) {
            startPosition.x += 150
        }
        else {
            startPosition.x -= 150
        }
        element.position(startPosition.x, startPosition.y + 100);
        currentLink.model.set({ target: element });
        currentLink.target = element.id;
        var link = new joint.shapes.standard.Link();
        objects.push({
            type: type,
            model: element,
            id: element.id,
            outgoing_link: {
                next: link.id
            }
        });
        link.source(element);
        link.target(currentEnd.model);
        link.addTo(graph);
        links.push({
            id: link.id,
            target: currentEnd.id,
            source: element.id,
            model: link
        });
        translateDown(currentEnd, null)
    } else if (currentLink.type == "ifend") {
        currentLink.model.vertices([])
        var currentEnd = findObject(currentLink.target)
        var currentStart = findObject(currentLink.source).model
        let startPosition = currentStart.position();
        element.position(startPosition.x, startPosition.y + 100);
        currentLink.model.set({ target: element });
        currentLink.target = element.id;
        currentLink.type = null
        var link = new joint.shapes.standard.Link();
        link.vertices([{
            x: vertices[0].x,
            y: vertices[0].y + 100
        }])
        objects.push({
            type: type,
            model: element,
            id: element.id,
            outgoing_link: {
                next: link.id
            }
        });
        link.source(element);
        link.target(currentEnd.model);
        link.addTo(graph);
        links.push({
            id: link.id,
            target: currentEnd.id,
            source: element.id,
            model: link,
            type: "ifend"
        });
        translateDown(currentEnd, null)
    }
}

function getCircle() {
    var circle = new joint.shapes.standard.Circle();
    circle.resize(25, 50);
    circle.attr('body/fill', 'lightblue');
    return circle;
}

/**
 * Adds a if Element to the given Link
 * @param {"The link on which to add"} currentLink 
 * @param {"The if element to add"} element 
 * @param {"The type"} type 
 */

function addElementIf(currentLink, element, type) {
    let vertices = currentLink.model.vertices()
    if (vertices.length == 2) {
        //This is to keep the array sorted
        if (vertices[0].y > vertices[1].y) {
            swap(vertices[0], vertices[1])
        }
    }
    var currentEnd = findObject(currentLink.target)
    var currentStart = findObject(currentLink.source)
    var startType = currentStart.type
    currentStart = currentStart.model
    let startPosition = currentStart.position();
    if (currentLink.type == "if" || currentLink.type == "ifstart") {
        if (startPosition.x <= vertices[0].x) {
            startPosition.x += 125
        }
        else {
            startPosition.x -= 175
        }
    }


    //Set Current End of the link to IF element 
    currentLink.model.set({ target: element });
    currentLink.target = element.id;

    //Make a new circle 
    var endCircle = getCircle();
    endCircle.addTo(graph);
    if (startType == 'circle') {
        element.position(startPosition.x, startPosition.y + 100);
        endCircle.position(startPosition.x, startPosition.y + 200);
    } else {
        element.position(startPosition.x + 25, startPosition.y + 100);
        endCircle.position(startPosition.x + 60, startPosition.y + 200);
    }

    //Creating the invisible link
    var invisibleLink = new joint.shapes.standard.Link();
    invisibleLink.source(element)
    invisibleLink.target(endCircle)
    invisibleLink.addTo(graph)
    invisibleLink.attr("./display", "none");
    links.push({
        id: invisibleLink.id,
        target: endCircle.id,
        source: element.id,
        model: invisibleLink
    })

    let ifPosition = element.position();

    //Creating True Link
    var trueLink = new joint.shapes.standard.Link();
    trueLink.vertices([
        { x: ifPosition.x + 200, y: ifPosition.y + 50 },
        { x: ifPosition.x + 200, y: endCircle.position().y + 25 }]);
    trueLink.source(element)
    trueLink.target(endCircle)
    trueLink.addTo(graph)
    trueLink.appendLabel({
        attrs: { text: { text: 'True' } },
        position: { distance: 0.1 }
    });
    links.push({
        id: trueLink.id,
        target: endCircle.id,
        source: element.id,
        model: trueLink,
        type: "if"
    });

    //Creating False Link
    var falseLink = new joint.shapes.standard.Link();
    falseLink.vertices([
        { x: ifPosition.x - 100, y: ifPosition.y + 50 },
        { x: ifPosition.x - 100, y: endCircle.position().y + 25 }]);
    falseLink.source(element)
    falseLink.target(endCircle)
    falseLink.addTo(graph)
    falseLink.appendLabel({
        attrs: { text: { text: 'False' } },
        position: { distance: 0.1 }
    });
    links.push({
        id: falseLink.id,
        target: endCircle.id,
        source: element.id,
        model: falseLink,
        type: "if"
    });
    objects.push({
        type: type,
        model: element,
        id: element.id,
        outgoing_link: {
            next: invisibleLink.id,
            trueLink: trueLink.id,
            falseLink: falseLink.id
        }
    });

    //Creating the endLink
    var link = new joint.shapes.standard.Link();
    link.source(endCircle);
    link.target(currentEnd.model);
    link.addTo(graph);
    if (currentLink.type == "if") {
        currentLink.type = "ifstart"
        link.vertices([{
            x: vertices[1].x,
            y: vertices[1].y + 100
        }])
        links.push({
            id: link.id,
            target: currentEnd.id,
            source: endCircle.id,
            model: link,
            type: "ifend"
        });
        currentLink.model.vertices([vertices[0]])
    } else if (currentLink.type == "ifend") {
        currentLink.model.vertices([])
        link.vertices([{
            x: vertices[0].x,
            y: vertices[0].y + 100
        }])
        currentLink.type = null
        links.push({
            id: link.id,
            target: currentEnd.id,
            source: endCircle.id,
            model: link,
            type: "ifend"
        });
    } else {
        links.push({
            id: link.id,
            target: currentEnd.id,
            source: endCircle.id,
            model: link
        });
    }
    objects.push({
        type: "circle",
        model: endCircle,
        id: endCircle.id,
        outgoing_link: {
            next: link.id
        }
    });
    translateDown(currentEnd, null)
    translateDown(currentEnd, null)
    setListener(endCircle, "circle")
    setListener(element, "if")
}

/**
 * This translates the IF block down as an entity by 100 units
 * @param {"The if element to be translated"} element 
 */
function translateIF(element) {
    let nextLink = findLink(element.outgoing_link.next);
    let trueLink = findLink(element.outgoing_link.trueLink);
    let falseLink = findLink(element.outgoing_link.falseLink);
    if (nextLink.target == trueLink.target) {
        let vertices = trueLink.model.vertices()
        let newVertices = []
        newVertices.push({ x: vertices[0].x, y: vertices[0].y + 100 })
        newVertices.push({ x: vertices[1].x, y: vertices[1].y + 100 })
        trueLink.model.vertices(newVertices)
    } else {
        let vertices = trueLink.model.vertices()
        let newVertices = []
        newVertices.push({ x: vertices[0].x, y: vertices[0].y + 100 })
        trueLink.model.vertices(newVertices)
        translateDown(findObject(trueLink.target), findObject(nextLink.target))
    }

    if (nextLink.target == falseLink.target) {
        let vertices = falseLink.model.vertices()
        let newVertices = []
        newVertices.push({ x: vertices[0].x, y: vertices[0].y + 100 })
        newVertices.push({ x: vertices[1].x, y: vertices[1].y + 100 })
        falseLink.model.vertices(newVertices)
    } else {
        let vertices = falseLink.model.vertices()
        let newVertices = []
        newVertices.push({ x: vertices[0].x, y: vertices[0].y + 100 })
        falseLink.model.vertices(newVertices)
        translateDown(findObject(falseLink.target), findObject(nextLink.target))
    }
}

/**
 * Searches for the object in the global object array, based on ID
 * @param {ID to search with} id 
 */
function findObject(id) {
    return objects.find(x => x.id == id);
}

/**
 * Searches for the link object in the global links array, based on ID
 * @param {ID to search with} id 
 */
function findLink(id) {
    return links.find(x => x.id == id);
}

/**
 * Translates all objects down from nextElement to till by 100 units
 * @param {The element to start translation from} nextElement 
 * @param {The element till which translation should happen} till 
 */
function translateDown(nextElement, till) {
    while (nextElement != till) {
        nextElement.model.translate(0, 100);
        if (nextElement.type == 'if') {
            translateIF(nextElement);
        }
        if (nextElement.outgoing_link) {
            let link = findLink(nextElement.outgoing_link.next)
            let vertex = link.model.vertices();
            if (link.type == "ifend") {
                link.model.vertices([{
                    x: vertex[0].x,
                    y: vertex[0].y + 100
                }])
            }
            nextElement = findObject(link.target)
        } else {
            nextElement = null;
        }
    }
}

/**
 * This function sets custom listeners, on the given object
 * @param {The element to set listener} element 
 * @param {The type of the element} type 
 */
function setListener(element, type) {
    if (type == "circle") {
        element.on('change:position', function (endCircle, position) {
            let links1 = links.filter(x => x.target == endCircle.id);
            links1.forEach(link => {
                if (link.type) {
                    let vertices = link.model.vertices()
                    if (vertices.length == 2) {
                        if (vertices[0].y > vertices[1].y) {
                            swap(vertices[0], vertices[1])
                        }
                        vertices[1].y = position.y + 25
                        if (position.x > vertices[1].x) {
                            vertices[1].x = position.x - 140
                        } else {
                            vertices[1].x = position.x + 160
                        }
                    } else {
                        if (position.x > vertices[0].x) {
                            vertices[0].x = position.x - 140
                        } else {
                            vertices[0].x = position.x + 160
                        }
                        vertices[0].y = position.y + 25
                    }
                    link.model.vertices(vertices)
                }
            });
        });
    }
}