var paper = window.paper
var graph = window.graph
var objects = window.objects
var links = window.links
var currentLink

/**
 * This event fires if a link is double clicked.
 */
paper.on('link:pointerdblclick', function (linkView) {
  var id = linkView.model.id
  currentLink = links.find(x => x.id == id)
  $('#modal .modal-body').html(`<input onclick="addIF()" type="image" src="./assets/if.png" />
    <input onclick="addInput()" type="image" src="./assets/input.png" />
    <input onclick="addOutput()" type="image" src="./assets/output.png" />
    <input onclick="addAssignment()" type="image" src="./assets/assignment.png" />
    <input onclick="addDeclaration()" type="image" src="./assets/declaration.jpg" />`)
  $('#modal').modal('show')
})

function addOutput () {
  $('#modal').modal('hide')
  var Parallelogram = getParallelogram()
  Parallelogram.attr('label/text', getWrapText('output'))
  Parallelogram.addTo(graph)
  addElement(currentLink, Parallelogram, 'output')
}

function addInput () {
  $('#modal').modal('hide')
  var Parallelogram = getParallelogram()
  Parallelogram.attr('label/text', getWrapText('input'))
  Parallelogram.addTo(graph)
  addElement(currentLink, Parallelogram, 'input')
}

function addAssignment () {
  $('#modal').modal('hide')
  var Rectangle = getRectangle()
  Rectangle.attr('label/text', getWrapText('Statement'))
  Rectangle.addTo(graph)
  addElement(currentLink, Rectangle, 'assignment')
}

function addDeclaration () {
  $('#modal').modal('hide')
  var Rectangle = getRectangle()
  Rectangle.attr('label/text', getWrapText('Declare Variable'))
  Rectangle.addTo(graph)
  addElement(currentLink, Rectangle, 'declare')
}

function addIF () {
  $('#modal').modal('hide')
  var diamond = getDiamond()
  diamond.attr('label/text', getWrapText('if'))
  diamond.addTo(graph)
  addElementIf(currentLink, diamond, 'if')
}
