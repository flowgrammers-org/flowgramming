function translateUp(nextElement, till, currentElement, isWhile = false) {
    let curPos = currentElement.position(),
        nextPos = nextElement.position(),
        initTranslate = -100
    if (isWhile) initTranslate = -300
    while (nextElement !== till && curPos.x === nextPos.x) {
        nextElement.translate(0, initTranslate)
        if (nextElement.attr('element/type') === 'if') {
            translateIF(nextElement)
        }
        if (nextElement.attr('outgoing_link/next')) {
            const link = findModel(nextElement.attr('outgoing_link/next'))
            const vertex = link.vertices()
            if (link.attr('element/type') === 'ifEnd') {
                link.vertices([
                    {
                        x: vertex[0].x,
                        y: vertex[0].y - 100,
                    },
                ])
            }
            nextElement = findModel(link.attr('element/target'))
            nextPos = nextElement.position()
        } else {
            nextElement = null
        }
    }
}

function findPrevLink(id) {
    return graph.attributes.cells.models.filter(
        (x) => x.attr('element/target') == id
    )[0]
}
function findNextLink(id) {
    return graph.attributes.cells.models.filter(
        (x) => x.attr('element/source') == id
    )[0]
}

function makeLinks(newStart, currentEnd, prevLink, nextLink) {
    var link = new joint.shapes.standard.Link()
    link.source(newStart)
    link.target(currentEnd)
    link.addTo(graph)
    link.attr({
        element: {
            target: currentEnd.id,
            source: newStart.id,
            type: prevLink.attr('element/type'),
        },
    })
    const elementPosition = newStart.position()
    if (
        currentEnd.attr('element/type') === 'circle' ||
        prevLink.attr('element/falselink') === 'true'
    ) {
        link.vertices([
            { x: elementPosition.x + 75, y: currentEnd.position().y + 25 },
        ])
        link.attr({
            element: {
                type: 'if',
            },
        })
    }
    if (nextLink.attr('element/type') === 'ifEnd') {
        link.attr({
            element: {
                type: 'ifEnd',
            },
        })
    }
    switch (nextLink.attr('element/type')) {
        case 'whileEnd':
            link.vertices([
                ...link.vertices(),
                { x: elementPosition.x - 100, y: elementPosition.y + 30 },
            ])
            link.attr({
                element: {
                    type: 'whileEnd',
                },
            })
            break
        case 'ifEnd':
            let xPos = nextLink.vertices()[0].x
            link.vertices([
                ...link.vertices(),
                {
                    x: xPos,
                    y: currentEnd.position().y + 25,
                },
            ])

            link.attr({
                element: {
                    type: 'ifEnd',
                    falseLink: 'false',
                },
            })

            break
    }

    switch (prevLink.attr('element/type')) {
        case 'ifStart':
            link.attr({
                element: {
                    type: 'ifStart',
                },
            })

            if (prevLink.attr('element/falselink') === 'true') {
                link.vertices([
                    { x: elementPosition.x - 100, y: elementPosition.y + 50 },
                    {
                        x: elementPosition.x - 100,
                        y: currentEnd.position().y + 25,
                    },
                ])
                link.appendLabel({
                    attrs: { text: { text: 'False' } },
                    position: { distance: 0.1 },
                })
                link.attr({
                    element: {
                        type: 'if',
                        falselink: 'true',
                    },
                })
                newStart.attr({
                    outgoing_link: {
                        ...newStart.attr('outgoing_link'),
                        falseLink: link.id,
                    },
                })
            } else {
                link.vertices([
                    { x: elementPosition.x + 200, y: elementPosition.y + 50 },
                    {
                        x: elementPosition.x + 200,
                        y: currentEnd.position().y + 25,
                    },
                ])
                link.appendLabel({
                    attrs: { text: { text: 'True' } },
                    position: { distance: 0.1 },
                })
                link.attr({
                    element: {
                        type: 'if',
                        falselink: 'false',
                    },
                })
                newStart.attr({
                    outgoing_link: {
                        ...newStart.attr('outgoing_link'),
                        trueLink: link.id,
                    },
                })
            }
            break
        case 'whileStart':
            if (nextLink.attr('element/type') === 'whileEnd')
                link.vertices([
                    { x: elementPosition.x + 350, y: elementPosition.y + 37.5 },
                    { x: elementPosition.x + 350, y: elementPosition.y + 150 },
                    { x: elementPosition.x + 150, y: elementPosition.y + 150 },
                ])
            else {
                link.vertices([
                    { x: elementPosition.x + 350, y: elementPosition.y + 31.5 },
                    { x: elementPosition.x + 350, y: elementPosition.y + 150 },
                ])
            }
            link.appendLabel({
                attrs: { text: { text: 'True' } },
                position: { distance: 0.1 },
            })
            link.attr({
                element: {
                    type: 'whileStart',
                },
            })
            newStart.attr({
                outgoing_link: {
                    ...newStart.attr('outgoing_link'),
                    loopLink: link.id,
                },
            })
            break
        case 'doWhileStart':
            if (nextLink.attr('element/type') === 'doWhileEnd') {
                /**
                 * Handling Empty do while block
                 */
                link.vertices([
                    { x: elementPosition.x + 350, y: elementPosition.y + 37.5 },
                    { x: elementPosition.x + 350, y: elementPosition.y + 150 },
                    { x: elementPosition.x + 150, y: elementPosition.y + 150 },
                ])
            }
        default:
            newStart.attr({
                outgoing_link: {
                    ...newStart.attr('outgoing_link'),
                    next: link.id,
                },
            })
    }
}

function deleteBlock(currentElement) {
    prevLink = findPrevLink(currentElement.id)
    nextLink = findNextLink(currentElement.id)
    currentEnd = findModel(nextLink.attr('element/target'))
    newStart = findModel(prevLink.attr('element/source'))
    translateUp(currentEnd, null, currentElement)
    makeLinks(newStart, currentEnd, prevLink, nextLink)
    prevLink.remove()
    nextLink.remove()
    currentElement.remove()
}

function checkNested(element, nextElement) {
    let nested = false
    while (element !== nextElement) {
        let nLink = findNextLink(element.id),
            next = findModel(nLink.attr('element/target'))
        if (
            element.attr('element/type') === 'if' ||
            element.attr('element/type') === 'while' ||
            element.attr('element/type') === 'doWhileExpr'
        ) {
            nested = true
            break
        }
        element = next
    }
    return nested
}

function deleteIF(element) {
    nextLink = findNextLink(element.id)
    currentEnd = findModel(nextLink.attr('element/target'))
    let trueLink = findModel(element.attr('outgoing_link/trueLink')),
        trueBlock = findModel(trueLink.attr('element/target')),
        nextElement = currentEnd,
        falseLink = findModel(element.attr('outgoing_link/falseLink')),
        falseBlock = findModel(falseLink.attr('element/target'))
    let nested =
        checkNested(trueBlock, nextElement) ||
        checkNested(falseBlock, nextElement)

    if (nested) throw new Error('Delete the nested component first!')
    while (trueBlock !== nextElement) {
        let nLink = findNextLink(trueBlock.id),
            next = findModel(nLink.attr('element/target'))
        deleteBlock(trueBlock)
        trueBlock = next
    }
    while (falseBlock !== nextElement) {
        let nLink = findNextLink(falseBlock.id),
            next = findModel(nLink.attr('element/target'))
        deleteBlock(falseBlock)
        falseBlock = next
    }
    deleteBlock(currentEnd)
    deleteBlock(element)
    trueLink.remove()
    falseLink.remove()
}

function deleteWhile(currentElement) {
    let loopLink = findModel(currentElement.attr('outgoing_link/loopLink')),
        loopBlock = findModel(loopLink.attr('element/target'))
    if (checkNested(loopBlock, currentElement))
        throw new Error('Delete the nested component first!')
    while (loopBlock !== currentElement) {
        let nLink = findNextLink(loopBlock.id),
            next = findModel(nLink.attr('element/target'))
        deleteBlock(loopBlock)
        loopBlock = next
    }
    loopLink.remove()
    prevLink = findPrevLink(currentElement.id)
    nextLink = findModel(currentElement.attr('outgoing_link/next'))
    circle = findModel(nextLink.attr('element/target'))
    nextLink = findModel(circle.attr('outgoing_link/next'))
    currentEnd = findModel(nextLink.attr('element/target'))
    newStart = findModel(prevLink.attr('element/source'))
    translateUp(currentEnd, null, currentElement, true)
    makeLinks(newStart, currentEnd, prevLink, nextLink)
    circle.remove()
    currentElement.remove()
}
