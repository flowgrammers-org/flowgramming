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
    $('#modal .modal-body').html(`<input onclick="addIF()" type="image" src="./assets/if.png" />
    <input onclick="addWhile()" height="63px" width="124px" type="image" src="./assets/while.png" />
    <input onclick="addInput()" type="image" src="./assets/input.png" />
    <input onclick="addOutput()" type="image" src="./assets/output.png" />
    <input onclick="addAssignment()" type="image" src="./assets/assignment.png" />
    <input onclick="addDeclaration()" type="image" src="./assets/declaration.jpg" />`)
    $('#modal').modal('show')
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
