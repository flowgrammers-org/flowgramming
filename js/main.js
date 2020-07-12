var graph = new joint.dia.Graph()
var objects = []
var links = []
var variables = []
window.objects = objects
window.links = links
window.variables = variables
window.geval = eval

var paper = new joint.dia.Paper({
  el: document.getElementById('myholder'),
  height: $('#papercol').height(),
  width: $('#papercol').width(),
  model: graph,
  gridSize: 1

})

graph.on('change:position', function () {
  paper.fitToContent({
    padding: 20,
    minWidth: $('#papercol').width(),
    minHeight: $('#papercol').height(),
    gridWidth: 10,
    gridHeight: 10
  })
})

var link = new joint.shapes.standard.Link()
var start = new joint.shapes.standard.Rectangle()
start.position(200, 30)
start.resize(150, 60)
start.attr({
  body: {
    fill: '#E74C3C',
    rx: 20,
    ry: 20,
    strokeWidth: 0
  },
  label: {
    text: 'Start',
    fill: '#ECF0F1'
  }
})

var startModel = {
  type: 'start',
  model: start,
  id: start.id,
  outgoing_link: {
    next: link.id
  }
}
objects.push(startModel)
start.addTo(graph)

var end = start.clone()
end.attr('label/text', 'End')

var endModel = {
  type: 'end',
  model: end,
  id: end.id
}
objects.push(endModel)
end.translate(0, 100)
end.addTo(graph)

link.source(start)
link.target(end)
link.addTo(graph)

links.push({
  id: link.id,
  source: start.id,
  target: end.id,
  model: link
})

window.paper = paper
window.graph = graph
window.start = startModel
