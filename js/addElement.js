/**
 * This event fires if a link is double clicked.
 */

const blockColors = {
    input: '#ffadad',
    output: '#caffbf',
    assignment: '#fdffb6',
    declaration: '#ffd6a5',
    while: '#9bf6ff',
    for: '#a0c4ff',
    doWhile: '#bdb2ff',
    if: '#ffc6ff',
    function: '#e0fbfc',
}

paper.on('link:pointerdblclick', function (linkView) {
    handleDoubleClick(linkView)
})

let doubleClickedLink

function handleDoubleClick(linkView) {
    if (
        ['whileFalse', 'doWhileTrue'].includes(
            linkView.model.attr('element/type')
        )
    ) {
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
    })
    newElementPaper.on('element:pointerclick', function (elementView) {
        $('#modal .modal-content').removeClass('modal-height')
        $('.joint-element').removeClass('cursor-click')
        $('#modal').modal('hide')
        const callBackMap = {
            OUTPUT: addOutput,
            INPUT: addInput,
            WHILE: addWhile,
            FOR: addForLoop,
            'DO-WHILE': addDoWhileLoop,
            ASSIGNMENT: addAssignment,
            DECLARATION: addDeclaration,
            IF: addIF,
            FUNCTION: addFunction,
        }
        callBackMap[elementView.model.attr('label/text')]()
    })

    populateAvailableElements(addElementGraph)

    $('#modal .modal-content').addClass('modal-height')
    $('#delbtn')
        .text('Close')
        .attr('data-dismiss', 'modal')
        .removeAttr('onclick')
    $('.joint-element').addClass('cursor-click')
    $('#modal').modal('show')
}

function populateAvailableElements(addElementGraph) {
    const output = getParallelogram()
    output.position(20, 20)
    output.resize(120, 63)
    output.attr({
        label: {
            text: 'OUTPUT',
        },
        body: {
            fill: blockColors.output,
        },
    })
    output.addTo(addElementGraph)

    const input = getParallelogram()
    input.resize(120, 63)
    input.position(output.position().x + 124, output.position().y)
    input.attr({
        label: {
            text: 'INPUT',
        },
        body: {
            fill: blockColors.input,
        },
    })
    input.addTo(addElementGraph)

    const assignment = getRectangle()
    assignment.resize(115, 63)
    assignment.position(output.position().x, output.position().y + 90)
    assignment.attr({
        label: {
            text: 'ASSIGNMENT',
        },
        body: {
            fill: blockColors.assignment,
        },
    })
    assignment.addTo(addElementGraph)

    const declaration = getRectangle()
    declaration.resize(115, 63)
    declaration.position(assignment.position().x + 130, assignment.position().y)
    declaration.attr({
        label: {
            text: 'DECLARATION',
        },
        body: {
            fill: blockColors.declaration,
        },
    })
    declaration.addTo(addElementGraph)

    const whileElement = getHexagon()
    whileElement.resize(115, 63)
    whileElement.position(assignment.position().x, assignment.position().y + 90)
    whileElement.attr({
        label: {
            text: 'WHILE',
        },
        body: {
            fill: blockColors.while,
        },
    })
    whileElement.addTo(addElementGraph)

    const forElement = getHexagon()
    forElement.resize(115, 63)
    forElement.position(
        whileElement.position().x + 130,
        whileElement.position().y
    )
    forElement.attr({
        label: {
            text: 'FOR',
        },
        body: {
            fill: blockColors.for,
        },
    })
    forElement.addTo(addElementGraph)

    const doWhile = getHexagon()
    doWhile.resize(115, 63)
    doWhile.position(whileElement.position().x, whileElement.position().y + 90)
    doWhile.attr({
        label: {
            text: 'DO-WHILE',
        },
        body: {
            fill: blockColors.doWhile,
        },
    })
    doWhile.addTo(addElementGraph)

    const ifElement = getDiamond()
    ifElement.resize(115, 63)
    ifElement.position(doWhile.position().x + 130, doWhile.position().y)
    ifElement.attr({
        label: {
            text: 'IF',
        },
        body: {
            fill: blockColors.if,
        },
    })
    ifElement.addTo(addElementGraph)

    const functionElement = getRectangle()
    functionElement.resize(115, 63)
    functionElement.position(doWhile.position().x, doWhile.position().y + 90)
    functionElement.attr({
        label: {
            text: 'FUNCTION',
        },
        body: {
            fill: blockColors.function,
        },
    })
    functionElement.addTo(addElementGraph)
}

function addOutput() {
    const Parallelogram = getParallelogram()
    Parallelogram.attr({
        label: {
            text: getWrapText('output'),
        },
        body: {
            fill: blockColors.output,
        },
    })
    Parallelogram.addTo(graph)
    addElement(doubleClickedLink, Parallelogram, 'output')
}

function addInput() {
    const Parallelogram = getParallelogram()
    Parallelogram.attr({
        label: {
            text: getWrapText('input'),
        },
        body: {
            fill: blockColors.input,
        },
    })
    Parallelogram.addTo(graph)
    addElement(doubleClickedLink, Parallelogram, 'input')
}

function addAssignment() {
    const Rectangle = getRectangle()
    Rectangle.attr({
        label: {
            text: getWrapText('Statement'),
        },
        body: {
            fill: blockColors.assignment,
        },
    })
    Rectangle.addTo(graph)
    addElement(doubleClickedLink, Rectangle, 'assignment')
}

function addFunction() {
    const Rectangle = getRectangle()
    Rectangle.attr({
        label: {
            text: getWrapText('Function'),
        },
        body: {
            fill: blockColors.function,
        },
    })
    Rectangle.addTo(graph)
    addElement(doubleClickedLink, Rectangle, 'function')
}

function addWhile() {
    const hexagon = getHexagon()
    hexagon.attr({
        label: {
            text: getWrapText('while'),
        },
        body: {
            fill: blockColors.while,
        },
    })
    hexagon.addTo(graph)
    addElementWhile(doubleClickedLink, hexagon, 'while')
}

function addForLoop() {
    const hexagon = getHexagon()
    hexagon.attr({
        label: {
            text: getWrapText('for'),
        },
        body: {
            fill: blockColors.for,
        },
    })
    hexagon.addTo(graph)
    addElementWhile(doubleClickedLink, hexagon, 'for')
}

function addDoWhileLoop() {
    const hexagon = getHexagon()
    hexagon.attr({
        label: {
            text: getWrapText('do-while'),
        },
        body: {
            fill: blockColors.doWhile,
        },
    })
    hexagon.addTo(graph)
    addElementDoWhile(doubleClickedLink, hexagon)
}

function addDeclaration() {
    const Rectangle = getRectangle()
    Rectangle.attr({
        label: {
            text: getWrapText('Declare Variable'),
        },
        body: {
            fill: blockColors.declaration,
        },
    })
    Rectangle.addTo(graph)
    addElement(doubleClickedLink, Rectangle, 'declare')
}

function addIF() {
    const diamond = getDiamond()
    diamond.attr({
        label: {
            text: getWrapText('if'),
        },
        body: {
            fill: blockColors.if,
        },
    })
    diamond.addTo(graph)
    addElementIf(doubleClickedLink, diamond, 'if')
}
