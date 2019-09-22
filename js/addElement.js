var paper = window.paper
var graph = window.graph
var objects = window.objects;
var links = window.links;
var currentLink;


/**
 * This event fires if a link is double clicked.
 */
paper.on('link:pointerdblclick', function (linkView) {
    var id = linkView.model.id;
    currentLink = links.find(x => x.id == id);
    $("#modal .modal-body").html(`<input onclick="addIF()" type="image" src="./src/if.png" />
    <input onclick="addInput()" type="image" src="./src/input.png" />
    <input onclick="addOutput()" type="image" src="./src/output.png" />
    <input onclick="addAssignment()" type="image" src="./src/assignment.png" />
    <input onclick="addDeclaration()" type="image" src="./src/declaration.jpg" />`);
    $('#modal').modal('show')
});

paper.on('element:pointerdblclick', function (elementView) {
    let id = elementView.model.id;
    let currentElement = objects.find(x => x.id == id);
    if (currentElement.type === 'declare') {
    $("#modal .modal-body").html(`
            <p>Enter Variable Name and Type</p>
            <div class="input-group">
                <input id="variable" type="text" class="form-control" aria-label="Text input with dropdown button">
                <p id="datatype" hidden>Default</p>
                <div class="input-group-append">
                    <button id="datatypebtn" class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">DataType
                    </button>
                    <div id="datatypedrop" class="dropdown-menu">
                        <a class="dropdown-item" onclick="toggle('String')">String</a>
                        <a class="dropdown-item" onclick="toggle('Integer')">Integer</a>
                        <a class="dropdown-item" onclick="toggle('Float')">Float</a>
            
                    </div>
                </div>
            </div>
            `);
    $('#modal').modal('show');
    $('#okbtn').on('click', function (event) {
        let variablename = $('#variable').val();
        let datatype = $('#datatype').html().trim();
        if(variablename.length > 0 && datatype != "Default"){
            $('#modal').modal('hide');
            currentElement.model.attr('label/text', getWrapText("Declare " + variablename));
        }
    })
    }

})


function addOutput() {
    $('#modal').modal('hide')
    var Parallelogram = getParallelogram();
    Parallelogram.attr('label/text', getWrapText("output"));
    Parallelogram.addTo(graph);
    addElement(currentLink, Parallelogram, "output");
}


function addInput() {
    $('#modal').modal('hide')
    var Parallelogram = getParallelogram();
    Parallelogram.attr('label/text', getWrapText("input"));
    Parallelogram.addTo(graph);
    addElement(currentLink, Parallelogram, "input");
}


function addAssignment() {
    $('#modal').modal('hide')
    var Rectangle = getRectangle();
    Rectangle.attr('label/text', getWrapText("Statement"));
    Rectangle.addTo(graph);
    addElement(currentLink, Rectangle, "assignment");
    // addElementIf(currentLink,Rectangle,"if");
}

function addDeclaration() {
    $('#modal').modal('hide')
    var Rectangle = getRectangle();
    Rectangle.attr('label/text', getWrapText("Declare Variable"));
    Rectangle.addTo(graph);
    addElement(currentLink, Rectangle, "declare");
}

function addIF() {
    $('#modal').modal('hide')
    var diamond = getDiamond();
    diamond.attr('label/text', getWrapText("if"));
    diamond.addTo(graph);
    addElementIf(currentLink, diamond, "if");
}

