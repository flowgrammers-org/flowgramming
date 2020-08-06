let graph = new joint.dia.Graph()
let variables = []
const globalEval = eval

const paperColumn = $('#paperColumn')
const paper = new joint.dia.Paper({
  el: document.getElementById('myHolder'),
  height: paperColumn.height(),
  width: paperColumn.width(),
  model: graph,
  gridSize: 1
})

graph.on('change:position', function () {
  paper.fitToContent({
    padding: 20,
    minWidth: paperColumn.width(),
    minHeight: paperColumn.height(),
    gridWidth: 10,
    gridHeight: 10
  })
})

const link = new joint.shapes.standard.Link()
let start = new joint.shapes.standard.Rectangle()
start.position(200, 30)
start.resize(150, 60)
start.attr({
  element: {
    type: 'start',
  },
  outgoing_link: {
    next: link.id
  },
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

start.addTo(graph)

const end = start.clone()
end.attr({
  label: {
    text: 'End'
  },
  element: {
    type: 'end'
  },
  outgoing_link: null
})

end.translate(0, 100)
end.addTo(graph)

link.source(start)
link.target(end)
link.addTo(graph)
link.attr({
  element: {
    source: start.id,
    target: end.id,
  }
})

window.onload = () => {
  'use strict'

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
  }
}
