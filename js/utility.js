/**
 * Returns a new parallelogram object
 */
function getParallelogram() {
    const parallelogram = new joint.shapes.standard.Path()
    parallelogram.resize(150, 75)
    parallelogram.attr('root/title', 'joint.shapes.standard.Path')
    parallelogram.attr('body/refD', 'M 21 1 L 197 0 L 173 69 L 0 69 Z')
    return parallelogram
}

/**
 * Returns a new diamond shaped object
 */
function getDiamond() {
    const diamond = new joint.shapes.standard.Path()
    diamond.resize(100, 100)
    diamond.attr('body/refD', 'M 30 0 L 60 30 30 60 0 30 Z')
    return diamond
}

/**
 * Returns a new hexagon shaped object
 * @returns {joint.shapes.standard.Path}
 */
function getHexagon() {
    const hexagon = new joint.shapes.standard.Path()
    hexagon.resize(150, 75)
    hexagon.attr('body/refD', 'M 100 30 L 0 30 L -25 67 L 0 105 L 100 105 L 125 67 L 100 30 Z')
    return hexagon
}

/**
 * Returns a new rectangle object
 */
function getRectangle() {
    const rect = new joint.shapes.standard.Rectangle()
    rect.resize(150, 75)
    return rect
}

/**
 * Returns a wrapText, extra text is replaced by ellipsis(...)
 */

function getWrapText(text) {
    return joint.util.breakText(text, {
        width: 120,
        height: 70
    }, {ellipsis: true})
}

function getCircle() {
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
function addElement(currentLink, element, type) {
    let link
    let currentStart
    let currentEnd
    const vertices = currentLink.vertices()
    currentEnd = findModel(currentLink.attr('element/target'))
    currentStart = findModel(currentLink.attr('element/source'))
    const startType = currentStart.attr('element/type')
    if (currentLink.attr('element/type') == null) {
        const startPosition = currentStart.position()

        if (startType === 'circle') {
            element.position(startPosition.x - 60, startPosition.y + 100)
        } else if (startType === 'while') {
            element.position(startPosition.x + 30, startPosition.y + 100)
        } else if (startType === 'doWhileExpr') {
            element.position(startPosition.x, startPosition.y + 150)
        } else {
            element.position(startPosition.x, startPosition.y + 100)
        }
        currentLink.set({target: element})

        currentLink.attr('element/target', element.id)
        link = new joint.shapes.standard.Link()

        element.attr({
            element: {type},
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
        currentLink.set({target: element})
        currentLink.attr('element/target', element.id)
        link = new joint.shapes.standard.Link()
        link.vertices([{
            x: vertices[1].x,
            y: vertices[1].y + 100
        }])
        element.attr({
            element: {type},
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
    } else if (currentLink.attr('element/type') === 'doWhile') {
        // Here there, are no elements inside the doWhile, thus split them into 2 parts

        // This is to keep the array sorted
        if (vertices[0].y > vertices[1].y) {
            swap(vertices[0], vertices[1])
        }
        currentLink.attr('element/type', 'doWhileStart')
        currentEnd = findModel(currentLink.attr('element/target'))
        currentStart = findModel(currentLink.attr('element/source'))
        const startPosition = currentStart.position()
        if (startPosition.x <= vertices[0].x) {
            startPosition.x += 125
        } else {
            startPosition.x -= 175
        }
        element.position(startPosition.x, startPosition.y + 100)
        currentLink.set({target: element})
        currentLink.attr('element/target', element.id)
        link = new joint.shapes.standard.Link()
        link.vertices([{
            x: vertices[1].x,
            y: vertices[1].y + 100
        }])
        element.attr({
            element: {type},
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
                type: 'doWhileEnd'
            }
        })
        currentLink.vertices([vertices[0]])
        translateDown(currentEnd, null)
    } else if (currentLink.attr('element/type') === 'while') {
        if (vertices[0].y > vertices[1].y) {
            swap(vertices[0], vertices[1])
        }
        currentLink.attr('element/type', 'whileStart')
        currentEnd = findModel(currentLink.attr('element/target'))
        currentStart = findModel(currentLink.attr('element/source'))
        const startPosition = currentStart.position()
        if (startPosition.x <= vertices[0].x) {
            startPosition.x += 225
        } else {
            startPosition.x -= 175
        }
        if (startType === 'circle') {
            element.position(startPosition.x - 60, startPosition.y + 100)
        } else if (startType === 'while') {
            element.position(startPosition.x, startPosition.y + 100)
        } else {
            element.position(startPosition.x, startPosition.y + 100)
        }
        currentLink.set({target: element})
        currentLink.attr('element/target', element.id)
        link = new joint.shapes.standard.Link()
        link.vertices([
            {x: vertices[1].x, y: vertices[1].y + 100},
            {x: vertices[1].x - 200, y: vertices[1].y + 100}
        ])
        element.attr({
            element: {type},
            outgoing_link: {
                next: link.id
            }
        })
        link.source(element)
        link.target(currentEnd, {
            anchor: {
                name: 'bottomRight',
                args: {
                    dx: -50
                }
            }
        })
        link.addTo(graph)
        link.attr({
            element: {
                target: currentEnd.id,
                source: element.id,
                type: 'whileEnd'
            }
        })
        currentLink.vertices([vertices[0]])
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
    } else if (['ifStart', 'whileStart', 'doWhileStart'].includes(currentLink.attr('element/type'))) {
        currentEnd = findModel(currentLink.attr('element/target'))
        currentStart = findModel(currentLink.attr('element/source'))
        const startPosition = currentStart.position()
        if (startPosition.x <= vertices[0].x) {
            startPosition.x += 175
        } else {
            startPosition.x -= 150
        }

        if (currentLink.attr('element/type') === 'whileStart') {
            startPosition.x += 50
        } else if (currentLink.attr('element/type') === 'doWhileStart') {
            startPosition.x -= 50
        }

        element.position(startPosition.x, startPosition.y + 100)
        currentLink.set({target: element})
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
    } else if (['ifEnd', 'whileEnd', 'doWhileEnd'].includes(currentLink.attr('element/type'))) {
        currentLink.vertices([])
        currentEnd = findModel(currentLink.attr('element/target'))
        currentStart = findModel(currentLink.attr('element/source'))
        const startPosition = currentStart.position()
        element.position(startPosition.x, startPosition.y + 100)
        currentLink.set({target: element})
        currentLink.attr('element/target', element.id)
        link = new joint.shapes.standard.Link()
        link.source(element)
        if (startType === 'circle') {
            element.position(startPosition.x - 60, startPosition.y + 100)
        } else if (startType === 'while') {
            element.position(startPosition.x + 30, startPosition.y + 100)
        } else {
            element.position(startPosition.x, startPosition.y + 100)
        }
        if (currentLink.attr('element/type') === 'whileEnd') {
            link.vertices([
                {x: vertices[0].x, y: vertices[0].y + 100},
                {x: vertices[1].x, y: vertices[1].y + 100},
            ])
            link.target(currentEnd, {
                anchor: {
                    name: 'bottomRight',
                    args: {
                        dx: -50
                    }
                }
            })
            element.attr({
                element: {type},
                outgoing_link: {
                    next: link.id
                }
            })
            link.addTo(graph)
            link.attr({
                element: {
                    target: currentEnd.id,
                    source: element.id,
                    type: currentLink.attr('element/type')
                }
            })
            currentLink.attr('element/type', null)
            translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
        } else {
            if (currentLink.attr('element/type') === 'doWhileEnd') {
                link.vertices([{
                    x: element.position().x + 75,
                    y: element.position().y + 187.5
                }])
            } else {
                link.vertices([{
                    x: element.position().x,
                    y: element.position().y + 100
                }])
            }
            link.target(currentEnd)
            element.attr({
                element: {type},
                outgoing_link: {
                    next: link.id
                }
            })
            link.addTo(graph)
            link.attr({
                element: {
                    target: currentEnd.id,
                    source: element.id,
                    type: currentLink.attr('element/type')
                }
            })
            currentLink.attr('element/type', null)
            translateDown(currentEnd, null)
        }
    }
}

function addElementDoWhile(currentLink, element) {
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
    } else if (['while', 'whileStart'].includes(currentLink.attr('element/type'))) {
        startPosition.x += 225
    } else if (['doWhile', 'doWhileStart'].includes(currentLink.attr('element/type'))) {
        startPosition.x += 187.5
    }


    // Make a new circle
    const doWhileStartCircle = getCircle()
    doWhileStartCircle.addTo(graph)
    if (startType === 'circle') {
        doWhileStartCircle.position(startPosition.x, startPosition.y + 100)
        element.position(startPosition.x - 62, startPosition.y + 200)
    } else {
        doWhileStartCircle.position(startPosition.x + 62, startPosition.y + 100)
        element.position(startPosition.x, startPosition.y + 250)
    }

    currentLink.set({target: doWhileStartCircle})
    currentLink.attr('element/target', doWhileStartCircle.id)

    // Creating the invisible link
    const trueLink = new joint.shapes.standard.Link()
    trueLink.source(element)
    trueLink.target(doWhileStartCircle)
    trueLink.addTo(graph)
    trueLink.appendLabel({
        attrs: {text: {text: 'True'}},
        position: {distance: 0.2}
    })
    trueLink.attr({
        element: {
            target: doWhileStartCircle.id,
            source: element.id,
            type: 'doWhileTrue'
        }
    })

    const endCirclePosition = doWhileStartCircle.position()

    // Creating True Link
    const loopLink = new joint.shapes.standard.Link()
    loopLink.vertices([
        {x: endCirclePosition.x + 200, y: endCirclePosition.y + 25},
        {x: endCirclePosition.x + 200, y: element.position().y + 38.5}])
    loopLink.source(doWhileStartCircle)
    loopLink.target(element)
    loopLink.addTo(graph)
    loopLink.attr({
        element: {
            target: element.id,
            source: doWhileStartCircle.id,
            type: 'doWhile'
        }
    })

    // Creating the endLink
    const link = new joint.shapes.standard.Link()
    link.source(element)
    link.target(currentEnd)
    link.appendLabel({
        attrs: {text: {text: 'False'}},
        position: {distance: 0.18}
    })
    link.addTo(graph)

    element.attr({
        element: {
            type: 'doWhileExpr'
        },
        outgoing_link: {
            next: link.id,
            loopLink: trueLink.id
        }
    })

    // Creating the invisible link for helping in translating down
    const invisibleLink = new joint.shapes.standard.Link()
    invisibleLink.source(doWhileStartCircle)
    invisibleLink.target(element)
    invisibleLink.addTo(graph)
    invisibleLink.attr('./display', 'none')
    invisibleLink.attr({
        element: {
            target: element.id,
            source: doWhileStartCircle.id,
        }
    })

    const currentLinkType = currentLink.attr('element/type')
    if (['if', 'doWhile'].includes(currentLinkType)) {
        currentLink.attr({
            element: {
                type: `${currentLinkType}Start`
            }
        })
        if (currentLinkType === 'doWhile') {
            link.vertices([{
                x: element.position().x + 75,
                y: vertices[1].y + 300
            }])
        } else {
            link.vertices([{
                x: vertices[1].x,
                y: vertices[1].y + 100
            }])
        }
        link.attr({
            element: {
                target: currentEnd.id,
                source: element.id,
                type: `${currentLinkType}End`
            }
        })
        currentLink.vertices([vertices[0]])
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
    } else if (['ifEnd', 'doWhileEnd'].includes(currentLinkType)) {
        currentLink.vertices([])
        link.vertices([{
            x: vertices[0].x,
            y: vertices[0].y + (currentLinkType === 'doWhileEnd' ? 300 : 100)
        }])
        currentLink.attr('element/type', null)
        link.attr({
            element: {
                target: currentEnd.id,
                source: element.id,
                type: currentLinkType
            }
        })
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
    } else if (currentLinkType === 'whileEnd') {
        currentLink.vertices([])
        link.vertices([
            {x: vertices[0].x, y: element.position().y + 175},
            {x: vertices[1].x, y: element.position().y + 175},
        ])
        link.target(currentEnd, {
            anchor: {
                name: 'bottomRight',
                args: {
                    dx: -50
                }
            }
        })
        currentLink.attr('element/type', null)
        link.attr({
            element: {
                target: currentEnd.id,
                source: element.id,
                type: 'whileEnd'
            }
        })
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
    } else if (currentLinkType === 'while') {
        link.target(currentEnd, {
            anchor: {
                name: 'bottomRight',
                args: {
                    dx: -50
                }
            }
        })
        currentLink.attr({
            element: {
                type: 'whileStart'
            }
        })
        link.attr({
            element: {
                target: currentEnd.id,
                source: element.id,
                type: 'whileEnd'
            }
        })
        link.vertices([
            {x: vertices[1].x, y: element.position().y + 100},
            {x: vertices[2].x, y: element.position().y + 100},
        ])
        currentLink.vertices([vertices[0]])
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
    } else {
        link.attr({
            element: {
                target: currentEnd.id,
                source: element.id,
            }
        })
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
    }
    doWhileStartCircle.attr({
        element: {
            type: 'circle',
            circleType: 'doWhile'
        },
        outgoing_link: {
            next: loopLink.id,
            invisibleLink: invisibleLink.id
        }
    })
}

function addElementWhile(currentLink, element, type) {
    const vertices = currentLink.vertices()
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
    } else if (['while', 'whileStart'].includes(currentLink.attr('element/type'))) {
        startPosition.x += 225
    } else if (['doWhile', 'doWhileStart'].includes(currentLink.attr('element/type'))) {
        startPosition.x += 187.5
    }

    // Set Current End of the link to while element
    currentLink.set({target: element})
    currentLink.attr('element/target', element.id)

    // Make a new circle
    const endCircle = getCircle()

    endCircle.addTo(graph)
    if (startType === 'circle') {
        element.position(startPosition.x - 62, startPosition.y + 100)
        endCircle.position(startPosition.x, startPosition.y + 300)
    } else {
        element.position(startPosition.x, startPosition.y + 150)
        endCircle.position(startPosition.x + 62, startPosition.y + 300)
    }

    const whilePosition = element.position()

    // Creating True Link
    const loopLink = new joint.shapes.standard.Link()
    loopLink.vertices([
        {x: whilePosition.x + 300, y: whilePosition.y + 37.5},
        {x: whilePosition.x + 300, y: whilePosition.y + 120},
        {x: whilePosition.x + 100, y: whilePosition.y + 120}
    ])
    loopLink.source(element)
    loopLink.target(element, {
        anchor: {
            name: 'bottomRight',
            args: {
                dx: -50
            }
        }
    })
    loopLink.addTo(graph)
    loopLink.appendLabel({
        attrs: {text: {text: 'True'}},
        position: {distance: 0.1}
    })
    loopLink.attr({
        element: {
            target: element.id,
            source: element.id,
            type: 'while'
        },
    })

    // Creating the endLink
    const endLink = new joint.shapes.standard.Link()

    // Creating False Link
    const nextLink = new joint.shapes.standard.Link()
    nextLink.source(element)
    nextLink.target(endCircle)
    nextLink.addTo(graph)

    nextLink.appendLabel({
        attrs: {text: {text: 'False'}},
        position: {distance: 0.2}
    })

    endLink.source(endCircle)
    endLink.target(currentEnd)
    endLink.addTo(graph)

    let whileFlag = false

    if (currentLink.attr('element/type') === 'doWhile') {
        currentLink.attr({
            element: {
                type: 'doWhileStart'
            }
        })
        endLink.vertices([{
            x: vertices[1].x,
            y: vertices[1].y + 300
        }])
        endLink.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
                type: 'doWhileEnd'
            }
        })
        currentLink.vertices([vertices[0]])
    } else if (currentLink.attr('element/type') === 'doWhileEnd') {
        currentLink.vertices([])
        endLink.vertices([{
            x: vertices[0].x,
            y: vertices[0].y + 300
        }])
        currentLink.attr('element/type', null)
        endLink.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
                type: 'doWhileEnd'
            }
        })
    } else if (currentLink.attr('element/type') === 'if') {
        currentLink.attr({
            element: {
                type: 'ifStart'
            }
        })
        endLink.vertices([{
            x: vertices[1].x,
            y: vertices[1].y + 175
        }])
        endLink.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
                type: 'ifEnd'
            }
        })
        currentLink.vertices([vertices[0]])
    } else if (currentLink.attr('element/type') === 'ifEnd') {
        currentLink.vertices([])
        endLink.vertices([{
            x: vertices[0].x,
            y: vertices[0].y + 175
        }])
        currentLink.attr('element/type', null)
        endLink.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
                type: 'ifEnd'
            }
        })
    } else if (currentLink.attr('element/type') === 'whileEnd') {
        currentLink.vertices([])
        endLink.vertices([
            {x: vertices[0].x, y: endCircle.position().y + 100},
            {x: vertices[1].x, y: endCircle.position().y + 100},
        ])
        endLink.target(currentEnd, {
            anchor: {
                name: 'bottomRight',
                args: {
                    dx: -50
                }
            }
        })
        currentLink.attr('element/type', null)
        endLink.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
                type: 'whileEnd'
            }
        })
        whileFlag = true
    } else if (currentLink.attr('element/type') === 'while') {
        endLink.target(currentEnd, {
            anchor: {
                name: 'bottomRight',
                args: {
                    dx: -50
                }
            }
        })
        currentLink.attr({
            element: {
                type: 'whileStart'
            }
        })
        endLink.vertices([
            {x: vertices[1].x, y: endCircle.position().y + 100},
            {x: vertices[2].x, y: endCircle.position().y + 100},
        ])
        endLink.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
                type: 'whileEnd'
            }
        })
        currentLink.vertices([vertices[0]])
        whileFlag = true
    } else {
        endLink.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
            }
        })
    }
    nextLink.attr({
        element: {
            target: endCircle.id,
            source: element.id,
            type: 'whileFalse'
        }
    })
    endCircle.attr({
        element: {
            type: 'circle',
        },
        outgoing_link: {
            next: endLink.id
        }
    })
    element.attr({
        element: {
            type: 'while',
            loopType: type
        },
        outgoing_link: {
            next: nextLink.id,
            loopLink: loopLink.id
        }
    })
    if (whileFlag) {
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
    } else {
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
    }
}

/**
 * Adds a if Element to the given Link
 * @param currentLink The link on which to add
 * @param element The if element to add
 * @param {string} type
 */

function addElementIf(currentLink, element, type) {
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
    } else if (['while', 'whileStart'].includes(currentLink.attr('element/type'))) {
        startPosition.x += 225
    } else if (['doWhile', 'doWhileStart'].includes(currentLink.attr('element/type'))) {
        startPosition.x += 187.5
    }

    // Set Current End of the link to IF element
    currentLink.set({target: element})
    currentLink.attr('element/target', element.id)

    // Make a new circle
    const endCircle = getCircle()
    endCircle.addTo(graph)
    if (startType === 'circle') {
        element.position(startPosition.x - 37.5, startPosition.y + 100)
        endCircle.position(startPosition.x, startPosition.y + 200)
    } else {
        if (startType === 'doWhileExpr') {
            element.position(startPosition.x + 25, startPosition.y + 125)
            endCircle.position(startPosition.x + 60, startPosition.y + 225)
        } else {
            element.position(startPosition.x + 25, startPosition.y + 100)
            endCircle.position(startPosition.x + 60, startPosition.y + 200)
        }
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
        {x: ifPosition.x + 200, y: ifPosition.y + 50},
        {x: ifPosition.x + 200, y: endCircle.position().y + 25}])
    trueLink.source(element)
    trueLink.target(endCircle)
    trueLink.addTo(graph)
    trueLink.appendLabel({
        attrs: {text: {text: 'True'}},
        position: {distance: 0.1}
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
        {x: ifPosition.x - 100, y: ifPosition.y + 50},
        {x: ifPosition.x - 100, y: endCircle.position().y + 25}])
    falseLink.source(element)
    falseLink.target(endCircle)
    falseLink.addTo(graph)
    falseLink.appendLabel({
        attrs: {text: {text: 'False'}},
        position: {distance: 0.1}
    })
    falseLink.attr({
        element: {
            target: endCircle.id,
            source: element.id,
            type: 'if'
        }
    })
    element.attr({
        element: {type},
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

    if (currentLink.attr('element/type') === 'doWhile') {
        currentLink.attr({
            element: {
                type: 'doWhileStart'
            }
        })
        link.vertices([{
            x: vertices[1].x,
            y: vertices[1].y + 300
        }])
        link.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
                type: 'doWhileEnd'
            }
        })
        currentLink.vertices([vertices[0]])
        translateDown(currentEnd, null)
    } else if (currentLink.attr('element/type') === 'doWhileEnd') {
        currentLink.vertices([])
        link.vertices([{
            x: vertices[0].x,
            y: vertices[0].y + 200
        }])
        currentLink.attr('element/type', null)
        link.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
                type: 'doWhileEnd'
            }
        })
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
    } else if (currentLink.attr('element/type') === 'if') {
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
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
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
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
    } else if (currentLink.attr('element/type') === 'whileEnd') {
        currentLink.vertices([])
        link.vertices([
            {x: vertices[0].x, y: vertices[0].y + 175},
            {x: vertices[1].x, y: vertices[1].y + 175},
        ])
        link.target(currentEnd, {
            anchor: {
                name: 'bottomRight',
                args: {
                    dx: -50
                }
            }
        })
        currentLink.attr('element/type', null)
        link.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
                type: 'whileEnd'
            }
        })
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
    } else if (currentLink.attr('element/type') === 'while') {
        link.target(currentEnd, {
            anchor: {
                name: 'bottomRight',
                args: {
                    dx: -50
                }
            }
        })
        currentLink.attr({
            element: {
                type: 'whileStart'
            }
        })
        link.vertices([
            {x: vertices[1].x, y: vertices[1].y + 175},
            {x: vertices[2].x, y: vertices[2].y + 175},
        ])
        link.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
                type: 'whileEnd'
            }
        })
        currentLink.vertices([vertices[0]])
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
        translateDown(findModel(findModel(currentEnd.attr('outgoing_link/next')).attr('element/target')), null)
    } else {
        link.attr({
            element: {
                target: currentEnd.id,
                source: endCircle.id,
            }
        })
        translateDown(currentEnd, null)
        translateDown(currentEnd, null)
    }
    endCircle.attr({
        element: {
            type: 'circle',
        },
        outgoing_link: {
            next: link.id
        }
    })
    setListener(endCircle, 'circle')
    setListener(element, 'if')
}

/**
 * This translates the while block down as an entity by 100 units
 * @param {"The while element to be translated"} element
 */
function translateWhile(element) {
    const loopLink = findModel(element.attr('outgoing_link/loopLink'))
    const vertices = loopLink.vertices()
    const newVertices = []
    if (element.id === loopLink.attr('element/target')) {
        newVertices.push({x: vertices[0].x, y: vertices[0].y + 100})
        newVertices.push({x: vertices[1].x, y: vertices[1].y + 100})
        newVertices.push({x: vertices[2].x, y: vertices[2].y + 100})
        loopLink.vertices(newVertices)
    } else {
        newVertices.push({x: vertices[0].x, y: vertices[0].y + 100})
        loopLink.vertices(newVertices)
        translateDown(findModel(loopLink.attr('element/target')), element)
    }
}

/**
 * This translates the do-while block contents down as an entity by 100 units
 * @param element
 */
function translateDoWhile(element) {
    const nextLink = findModel(element.attr('outgoing_link/next'))
    const invisibleLink = findModel(element.attr('outgoing_link/invisibleLink'))
    if (invisibleLink.attr('element/target') === nextLink.attr('element/target')) {
        const vertices = nextLink.vertices()
        const newVertices = []
        newVertices.push({x: vertices[0].x, y: vertices[0].y + 100})
        newVertices.push({x: vertices[1].x, y: vertices[1].y + 100})
        nextLink.vertices(newVertices)
    } else {
        const vertices = nextLink.vertices()
        const newVertices = []
        newVertices.push({x: vertices[0].x, y: vertices[0].y + 100})
        nextLink.vertices(newVertices)
        translateDown(findModel(nextLink.attr('element/target')), findModel(invisibleLink.attr('element/target')))
    }
}

/**
 * This translates the IF block down as an entity by 100 units
 * @param {"The if element to be translated"} element
 */
function translateIF(element) {
    const nextLink = findModel(element.attr('outgoing_link/next'))
    const trueLink = findModel(element.attr('outgoing_link/trueLink'))
    const falseLink = findModel(element.attr('outgoing_link/falseLink'))
    if (nextLink.attr('element/target') === trueLink.attr('element/target')) {
        const vertices = trueLink.vertices()
        const newVertices = []
        newVertices.push({x: vertices[0].x, y: vertices[0].y + 100})
        newVertices.push({x: vertices[1].x, y: vertices[1].y + 100})
        trueLink.vertices(newVertices)
    } else {
        const vertices = trueLink.vertices()
        const newVertices = []
        newVertices.push({x: vertices[0].x, y: vertices[0].y + 100})
        trueLink.vertices(newVertices)
        translateDown(findModel(trueLink.attr('element/target')), findModel(nextLink.attr('element/target')))
    }

    if (nextLink.attr('element/target') === falseLink.attr('element/target')) {
        const vertices = falseLink.vertices()
        const newVertices = []
        newVertices.push({x: vertices[0].x, y: vertices[0].y + 100})
        newVertices.push({x: vertices[1].x, y: vertices[1].y + 100})
        falseLink.vertices(newVertices)
    } else {
        const vertices = falseLink.vertices()
        const newVertices = []
        newVertices.push({x: vertices[0].x, y: vertices[0].y + 100})
        falseLink.vertices(newVertices)
        translateDown(findModel(falseLink.attr('element/target')), findModel(nextLink.attr('element/target')))
    }
}

/**
 * Translates all objects down from nextElement to till by 100 units
 * @param nextElement - The element to start translation from nextElement
 * @param till - The element till which translation should happen
 */
function translateDown(nextElement, till) {
    let link
    while (nextElement !== till) {
        if (
            !(
                nextElement.attr('element/type') === 'while'
                && (
                    link && ['while', 'whileEnd'].includes(link.attr('element/type'))
                )
            )
        ) {
            nextElement.translate(0, 100)
            const translateFuncMap = {
                'if': translateIF,
                'while': translateWhile,
                'doWhile': translateDoWhile
            }
            const currentElementType = nextElement.attr('element/type')
            const currentCircleType = nextElement.attr('element/circleType')
            const specialTranslateFunc = translateFuncMap[currentElementType] || translateFuncMap[currentCircleType]
            if (specialTranslateFunc) {
                specialTranslateFunc(nextElement)
            }
        }
        if (nextElement.attr('outgoing_link')) {
            if (nextElement.attr('element/circleType') === 'doWhile') {
                link = findModel(nextElement.attr('outgoing_link/invisibleLink'))
            } else {
                link = findModel(nextElement.attr('outgoing_link/next'))
            }
            switch (link.attr('element/type')) {
                case 'ifEnd' :
                case 'doWhileEnd' :
                    const vertex = link.vertices()
                    link.vertices([
                        {
                            x: vertex[0].x,
                            y: vertex[0].y + 100
                        }
                    ])
                    break
                case 'whileEnd' :
                    const vertices = link.vertices()
                    link.vertices([
                        {x: vertices[0].x, y: vertices[0].y + 100},
                        {x: vertices[1].x, y: vertices[1].y + 100}
                    ])
                    break
            }
            nextElement = findModel(link.attr('element/target'))
        } else {
            nextElement = null
        }
    }
}

/**
 * Searches for the model in the graph, based on ID
 * @param id
 */
function findModel(id) {
    return graph.attributes.cells.models.find(x => x.id === id)
}

/**
 * This function sets custom listeners, on the given object
 * @param element The element to set listener
 * @param type The type of the element
 */
function setListener(element, type) {
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
