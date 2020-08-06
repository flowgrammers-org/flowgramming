/**
 * Returns a new parallelogram object
 */
function getParallelogram () {
  const parallelogram = new joint.shapes.standard.Path()
  parallelogram.resize(150, 75)
  parallelogram.attr('root/title', 'joint.shapes.standard.Path')
  parallelogram.attr('body/refD', 'M 21 1 L 197 0 L 173 69 L 0 69 Z')
  return parallelogram
}

/**
 * Returns a new diamond shaped object
 */
function getDiamond () {
  const diamond = new joint.shapes.standard.Path()
  diamond.resize(100, 100)
  diamond.attr('body/refD', 'M 30 0 L 60 30 30 60 0 30 Z')
  return diamond
}

/**
 * Returns a new rectangle object
 */
function getRectangle () {
  const rect = new joint.shapes.standard.Rectangle()
  rect.resize(150, 75)
  return rect
}

/**
 * Returns a wrapText, extra text is replaced by ellipsis(...)
 */

function getWrapText (text) {
  return joint.util.breakText(text, {
    width: 120,
    height: 70
  }, { ellipsis: true })
}

function getCircle () {
  const circle = new joint.shapes.standard.Circle()
  circle.resize(25, 50)
  circle.attr('body/fill', 'lightblue')
  return circle
}

/**
 * Adds the given element to the graph, used for declare,assignment,input,output
 * @param currentLink "The link to add the element"
 * @param element "The element to add"
 * @param {string} type
 */
function addElement (currentLink, element, type) {
  let link
  let currentStart
  let currentEnd
  const vertices = currentLink.vertices()
  if (currentLink.attr('element/type') == null) {
    currentEnd = findModel(currentLink.attr('element/target'))
    currentStart = findModel(currentLink.attr('element/source'))
    const startPosition = currentStart.position()
    element.position(startPosition.x, startPosition.y + 100)
    currentLink.set({ target: element })

    currentLink.attr('element/target', element.id)
    link = new joint.shapes.standard.Link()

    element.attr({
      element: { type },
      outgoing_link: {
        next: link.id
      }
    })
    link.source(element)
    link.target(currentEnd)
    link.addTo(graph)
    link.attr({
      element: {
        target: currentEnd.id,
        source: element.id,
      }
    })
    translateDown(currentEnd, null)
  } else if (currentLink.attr('element/type') === 'if') {
    // Here there, are no elements inside the if, thus split into ifStart and ifEnd
    // This is to keep the array sorted
    if (vertices[0].y > vertices[1].y) {
      swap(vertices[0], vertices[1])
    }
    currentLink.attr('element/type', 'ifStart')
    currentEnd = findModel(currentLink.attr('element/target'))
    currentStart = findModel(currentLink.attr('element/source'))
    const startPosition = currentStart.position()
    if (startPosition.x <= vertices[0].x) {
      startPosition.x += 125
    } else {
      startPosition.x -= 175
    }
    element.position(startPosition.x, startPosition.y + 100)
    currentLink.set({ target: element })
    currentLink.attr('element/target', element.id)
    link = new joint.shapes.standard.Link()
    link.vertices([{
      x: vertices[1].x,
      y: vertices[1].y + 100
    }])
    element.attr({
      element: { type },
      outgoing_link: {
        next: link.id
      }
    })
    link.source(element)
    link.target(currentEnd)
    link.addTo(graph)
    link.attr({
      element: {
        target: currentEnd.id,
        source: element.id,
        type: 'ifEnd'
      }
    })
    currentLink.vertices([vertices[0]])
    translateDown(currentEnd, null)
  } else if (currentLink.attr('element/type') === 'ifStart') {
    currentEnd = findModel(currentLink.attr('element/target'))
    currentStart = findModel(currentLink.attr('element/source'))
    const startPosition = currentStart.position()
    if (startPosition.x <= vertices[0].x) {
      startPosition.x += 150
    } else {
      startPosition.x -= 150
    }
    element.position(startPosition.x, startPosition.y + 100)
    currentLink.set({ target: element })
    currentLink.attr('element/target', element.id)
    link = new joint.shapes.standard.Link()
    element.attr({
      element: {
        type,
      },
      outgoing_link: {
        next: link.id
      }
    })
    link.source(element)
    link.target(currentEnd)
    link.addTo(graph)
    link.attr({
      element: {
        target: currentEnd.id,
        source: element.id,
      }
    })
    translateDown(currentEnd, null)
  } else if (currentLink.attr('element/type') === 'ifEnd') {
    currentLink.vertices([])
    currentEnd = findModel(currentLink.attr('element/target'))
    currentStart = findModel(currentLink.attr('element/source'))
    const startPosition = currentStart.position()
    element.position(startPosition.x, startPosition.y + 100)
    currentLink.set({ target: element })
    currentLink.attr('element/target', element.id)
    currentLink.attr('element/type', null)
    link = new joint.shapes.standard.Link()
    link.vertices([{
      x: vertices[0].x,
      y: vertices[0].y + 100
    }])
    element.attr({
      element: { type },
      outgoing_link: {
        next: link.id
      }
    })
    link.source(element)
    link.target(currentEnd)
    link.addTo(graph)
    link.attr({
      element: {
        target: currentEnd.id,
        source: element.id,
        type: 'ifEnd'
      }
    })
    translateDown(currentEnd, null)
  }
}

/**
 * Adds a if Element to the given Link
 * @param currentLink The link on which to add
 * @param element The if element to add
 * @param {string} type
 */

function addElementIf (currentLink, element, type) {
  const vertices = currentLink.vertices()
  if (vertices.length === 2) {
    // This is to keep the array sorted
    if (vertices[0].y > vertices[1].y) {
      swap(vertices[0], vertices[1])
    }
  }
  const currentEnd = findModel(currentLink.attr('element/target'))
  let currentStart = findModel(currentLink.attr('element/source'))
  const startType = currentStart.attr('element/type')
  const startPosition = currentStart.position()
  if (['if', 'ifStart'].includes(currentLink.attr('element/type'))) {
    if (startPosition.x <= vertices[0].x) {
      startPosition.x += 125
    } else {
      startPosition.x -= 175
    }
  }

  // Set Current End of the link to IF element
  currentLink.set({ target: element })
  currentLink.attr('element/target', element.id)

  // Make a new circle
  const endCircle = getCircle()
  endCircle.addTo(graph)
  if (startType === 'circle') {
    element.position(startPosition.x, startPosition.y + 100)
    endCircle.position(startPosition.x, startPosition.y + 200)
  } else {
    element.position(startPosition.x + 25, startPosition.y + 100)
    endCircle.position(startPosition.x + 60, startPosition.y + 200)
  }

  // Creating the invisible link
  const invisibleLink = new joint.shapes.standard.Link()
  invisibleLink.source(element)
  invisibleLink.target(endCircle)
  invisibleLink.addTo(graph)
  invisibleLink.attr('./display', 'none')
  invisibleLink.attr({
    element: {
      target: endCircle.id,
      source: element.id,
    }
  })

  const ifPosition = element.position()

  // Creating True Link
  const trueLink = new joint.shapes.standard.Link()
  trueLink.vertices([
    { x: ifPosition.x + 200, y: ifPosition.y + 50 },
    { x: ifPosition.x + 200, y: endCircle.position().y + 25 }])
  trueLink.source(element)
  trueLink.target(endCircle)
  trueLink.addTo(graph)
  trueLink.appendLabel({
    attrs: { text: { text: 'True' } },
    position: { distance: 0.1 }
  })
  trueLink.attr({
    element: {
      target: endCircle.id,
      source: element.id,
      type: 'if'
    }
  })

  // Creating False Link
  const falseLink = new joint.shapes.standard.Link()
  falseLink.vertices([
    { x: ifPosition.x - 100, y: ifPosition.y + 50 },
    { x: ifPosition.x - 100, y: endCircle.position().y + 25 }])
  falseLink.source(element)
  falseLink.target(endCircle)
  falseLink.addTo(graph)
  falseLink.appendLabel({
    attrs: { text: { text: 'False' } },
    position: { distance: 0.1 }
  })
  falseLink.attr({
    element: {
      target: endCircle.id,
      source: element.id,
      type: 'if'
    }
  })
  element.attr({
    element: { type },
    outgoing_link: {
      next: invisibleLink.id,
      trueLink: trueLink.id,
      falseLink: falseLink.id
    }
  })

  // Creating the endLink
  const link = new joint.shapes.standard.Link()
  link.source(endCircle)
  link.target(currentEnd)
  link.addTo(graph)
  if (currentLink.attr('element/type') === 'if') {
    currentLink.attr({
      element: {
        type: 'ifStart'
      }
    })
    link.vertices([{
      x: vertices[1].x,
      y: vertices[1].y + 100
    }])
    link.attr({
      element: {
        target: currentEnd.id,
        source: endCircle.id,
        type: 'ifEnd'
      }
    })
    currentLink.vertices([vertices[0]])
  } else if (currentLink.attr('element/type') === 'ifEnd') {
    currentLink.vertices([])
    link.vertices([{
      x: vertices[0].x,
      y: vertices[0].y + 100
    }])
    currentLink.attr('element/type', null)
    link.attr({
      element: {
        target: currentEnd.id,
        source: endCircle.id,
        type: 'ifEnd'
      }
    })
  } else {
    link.attr({
      element: {
        target: currentEnd.id,
        source: endCircle.id,
      }
    })
  }
  endCircle.attr({
    element: {
      type: 'circle',
    },
    outgoing_link: {
      next: link.id
    }
  })
  translateDown(currentEnd, null)
  translateDown(currentEnd, null)
  setListener(endCircle, 'circle')
  setListener(element, 'if')
}

/**
 * This translates the IF block down as an entity by 100 units
 * @param {"The if element to be translated"} element
 */
function translateIF (element) {
  const nextLink = findModel(element.attr('outgoing_link/next'))
  const trueLink = findModel(element.attr('outgoing_link/trueLink'))
  const falseLink = findModel(element.attr('outgoing_link/falseLink'))
  if (nextLink.attr('element/target') === trueLink.attr('element/target')) {
    const vertices = trueLink.vertices()
    const newVertices = []
    newVertices.push({ x: vertices[0].x, y: vertices[0].y + 100 })
    newVertices.push({ x: vertices[1].x, y: vertices[1].y + 100 })
    trueLink.vertices(newVertices)
  } else {
    const vertices = trueLink.vertices()
    const newVertices = []
    newVertices.push({ x: vertices[0].x, y: vertices[0].y + 100 })
    trueLink.vertices(newVertices)
    translateDown(findModel(trueLink.attr('element/target')), findModel(nextLink.attr('element/target')))
  }

  if (nextLink.attr('element/target') === falseLink.attr('element/target')) {
    const vertices = falseLink.vertices()
    const newVertices = []
    newVertices.push({ x: vertices[0].x, y: vertices[0].y + 100 })
    newVertices.push({ x: vertices[1].x, y: vertices[1].y + 100 })
    falseLink.vertices(newVertices)
  } else {
    const vertices = falseLink.vertices()
    const newVertices = []
    newVertices.push({ x: vertices[0].x, y: vertices[0].y + 100 })
    falseLink.vertices(newVertices)
    translateDown(findModel(falseLink.attr('element/target')), findModel(nextLink.attr('element/target')))
  }
}

/**
 * Searches for the model in the graph, based on ID
 * @param id
 */
function findModel (id) {
  return graph.attributes.cells.models.find(x => x.id === id)
}

/**
 * Translates all objects down from nextElement to till by 100 units
 * @param nextElement - The element to start translation from nextElement
 * @param till - The element till which translation should happen
 */
function translateDown (nextElement, till) {
  while (nextElement !== till) {
    nextElement.translate(0, 100)
    if (nextElement.attr('element/type') === 'if') {
      translateIF(nextElement)
    }
    if (nextElement.attr('outgoing_link')) {
      const link = findModel(nextElement.attr('outgoing_link/next'))
      const vertex = link.vertices()
      if (link.attr('element/type') === 'ifEnd') {
        link.vertices([{
          x: vertex[0].x,
          y: vertex[0].y + 100
        }])
      }
      nextElement = findModel(link.attr('element/target'))
    } else {
      nextElement = null
    }
  }
}

/**
 * This function sets custom listeners, on the given object
 * @param element The element to set listener
 * @param type The type of the element
 */
function setListener (element, type) {
  if (type === 'circle') {
    element.on('change:position', function (endCircle, position) {
      const links1 = graph.attributes.cells.models.filter(x => x.attr('element/target') === endCircle.id)
      links1.forEach(link => {
        if (link.attr('element/type')) {
          const vertices = link.vertices()
          if (vertices.length === 2) {
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
          link.vertices(vertices)
        }
      })
    })
  }
}
