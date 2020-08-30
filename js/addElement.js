/**
 * This event fires if a link is double clicked.
 */
paper.on('link:pointerdblclick', function (linkView) {
    handleDoubleClick(linkView)
})

let doubleClickedLink

function handleDoubleClick(linkView) {
    if (linkView.model.attr('element/type') === 'whileFalse') {
        return
    }
    const id = linkView.model.id
    doubleClickedLink = findModel(id)

    let addElementGraph = new joint.dia.Graph()
    const paperColumn = $('#modal .modal-body')
    const newElementPaper = new joint.dia.Paper({
        el: paperColumn,
        height: paperColumn.height,
        width: paperColumn.width,
        model: addElementGraph,
        gridSize: 1,
        interactive: false,
    });
    newElementPaper.on('element:pointerclick', function (elementView) {
        const callBackMap = {
            'OUTPUT' : addOutput,
            'INPUT' : addInput,
            'WHILE' : addWhile,
            'ASSIGNMENT' : addAssignment,
            'DECLARATION' : addDeclaration,
            'IF' : addIF
        }
        callBackMap[elementView.model.attr('label/text')]()
        $('#modal .modal-content').removeClass('modal-height')
        $('.joint-element').removeClass('cursor-click')
    })

    populateAvailableElements(addElementGraph)

    $('#modal .modal-content').addClass('modal-height')
    $('.joint-element').addClass('cursor-click')
    $('#modal').modal('show')
}

function populateAvailableElements(addElementGraph) {
    const output = getParallelogram()
    output.position(20, 20)
    output.resize(120, 63)
    output.attr('label/text', 'OUTPUT')
    output.addTo(addElementGraph)

    const input = getParallelogram()
    input.resize(120, 63)
    input.position(output.position().x + 124, output.position().y)
    input.attr('label/text', 'INPUT')
    input.addTo(addElementGraph)

    const assignment = getRectangle()
    assignment.resize(115, 63)
    assignment.position(output.position().x, output.position().y + 90)
    assignment.attr('label/text', 'ASSIGNMENT')
    assignment.addTo(addElementGraph)

    const declaration = getRectangle()
    declaration.resize(115, 63)
    declaration.position(assignment.position().x + 130, assignment.position().y)
    declaration.attr('label/text', 'DECLARATION')
    declaration.addTo(addElementGraph)

    const whileElement = getHexagon()
    whileElement.resize(115, 63)
    whileElement.position(assignment.position().x, assignment.position().y + 90)
    whileElement.attr('label/text', 'WHILE')
    whileElement.addTo(addElementGraph)

    const ifElement = getDiamond()
    ifElement.resize(115, 63)
    ifElement.position(whileElement.position().x + 130, whileElement.position().y)
    ifElement.attr('label/text', 'IF')
    ifElement.addTo(addElementGraph)
}

function addOutput() {
    $('#modal').modal('hide')
    const Parallelogram = getParallelogram()
    Parallelogram.attr('label/text', getWrapText('output'))
    Parallelogram.addTo(graph)
    addElement(doubleClickedLink, Parallelogram, 'output')
}

function addInput() {
    $('#modal').modal('hide')
    const Parallelogram = getParallelogram()
    Parallelogram.attr('label/text', getWrapText('input'))
    Parallelogram.addTo(graph)
    addElement(doubleClickedLink, Parallelogram, 'input')
}

function addAssignment() {
    $('#modal').modal('hide')
    const Rectangle = getRectangle()
    Rectangle.attr('label/text', getWrapText('Statement'))
    Rectangle.addTo(graph)
    addElement(doubleClickedLink, Rectangle, 'assignment')
}

function addWhile() {
    $('#modal').modal('hide')
    const hexagon = getHexagon()
    hexagon.attr('label/text', getWrapText('while'))
    hexagon.addTo(graph)
    addElementWhile(doubleClickedLink, hexagon, 'while')
}

function addDeclaration() {
    $('#modal').modal('hide')
    const Rectangle = getRectangle()
    Rectangle.attr('label/text', getWrapText('Declare Variable'))
    Rectangle.addTo(graph)
    addElement(doubleClickedLink, Rectangle, 'declare')
}

function addIF() {
    $('#modal').modal('hide')
    const diamond = getDiamond()
    diamond.attr('label/text', getWrapText('if'))
    diamond.addTo(graph)
    addElementIf(doubleClickedLink, diamond, 'if')
}
