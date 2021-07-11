/*
 # *************************************************************************************
 # Copyright (C) 2021 Ritwik Murali, Harshit Agarwal, Rajkumar S, Gali Mary Sanjana
 # This file is part of Flowgramming <https://github.com/flowgrammers-org/flowgramming>.
 #
 # Flowgramming is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # Flowgramming is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with Flowgramming.  If not, see <http://www.gnu.org/licenses/>.
 # *************************************************************************************
 */

let graph = new joint.dia.Graph()
let variables = []
const globalEval = eval
const disabledBlocks = ['start', 'end', 'circle']

let currentContextName = 'main'

const paperColumn = $('#paperColumn')

let paper = new joint.dia.Paper({
    el: document.getElementById('myHolder'),
    height: paperColumn.height(),
    width: paperColumn.width(),
    model: graph,
    gridSize: 1,
})

paper.on('element:pointerdblclick', function (elementView) {
    const currentElement = findModel(elementView.model.id)
    const currentElementType = currentElement.attr('element/type')
    if (!disabledBlocks.includes(currentElementType)) {
        handleElementDoubleClick(elementView)
    }
})

graph.on('change:position', function () {
    paper.fitToContent({
        padding: 20,
        minWidth: paperColumn.width(),
        minHeight: paperColumn.height(),
        gridWidth: 10,
        gridHeight: 10,
    })
})

let start = addStartAndEndBlock(currentContextName)

/**
 * Here, we mean 'functions' as different 'contexts'.
 * Hence, this object is the master copy of all the functions and
 * their properties (return variable, parameters, its own graph)
 */
let contexts = {
    main: {
        graph: graph.toJSON(),
        start,
    },
}

updateContextsDropdown()

function getParametersAndReturnType(contextName) {
    if (contextName !== 'main') {
        const context = getCurrentContexts()[contextName]
        var parameterString = ''
        if (context.parameters.length > 0) {
            context.parameters.forEach((parameter) => {
                parameterString +=
                    parameter.variableType + ' ' + parameter.variableName + ','
            })
            parameterString = parameterString.slice(
                0,
                parameterString.length - 1
            )
        }
        const returnType = context.returnType
            ? `return ${context.returnType} ${contextName}()`
            : `return void ${contextName}()`
        var parametersAndReturnType = {
            parameters: parameterString,
            returnType: returnType,
        }
    } else {
        var parametersAndReturnType = {
            parameters: '',
            returnType: `End ${contextName}()`,
        }
    }

    return parametersAndReturnType
}

/**
 * This is called whenever the dropdown for current context a.k.a function is changed
 * We first fetch the previous context's updated graph and store it in our main object
 * and then replace the current graph with the newly selected context's if not empty.
 * Otherwise, a new graph with start and end block for the same will be created.
 */
function switchContext() {
    contexts[currentContextName] = {
        ...(contexts[currentContextName] || {}),
        graph: graph.toJSON(),
    }
    currentContextName = $('#currentContext').val()
    const toContext = contexts[currentContextName]
    if (!toContext.graph) {
        graph.fromJSON(new joint.dia.Graph().toJSON())
        start = addStartAndEndBlock(currentContextName)
        contexts[currentContextName] = {
            ...(contexts[currentContextName] || {}),
            start,
            graph: graph.toJSON(),
        }
    } else {
        graph.fromJSON(toContext.graph)
    }
    paper.fitToContent({
        padding: 20,
        minWidth: paperColumn.width(),
        minHeight: paperColumn.height(),
        gridWidth: 10,
        gridHeight: 10,
    })
}

/**
 * A callback that will be triggered by the function manager window
 * once all the functions editing work is done.
 * @param localContexts
 */
function updateCurrentContexts(localContexts) {
    if (localContexts && localContexts.main) {
        delete localContexts['main']
    }
    contexts = {
        main: contexts.main,
        ...(localContexts || {}),
    }
    contexts[currentContextName].graph = graph.toJSON()

    for (context in localContexts) {
        if (localContexts[context].graph) {
            const parametersAndReturnType = getParametersAndReturnType(context)
            contexts[context].graph.cells[0].attrs.label.text = getWrapText(
                `Start ${context}(${parametersAndReturnType.parameters})`
            )
            contexts[context].graph.cells[1].attrs.label.text = getWrapText(
                parametersAndReturnType.returnType
            )
        }
    }
    graph.fromJSON(contexts[currentContextName].graph)
}

/**
 * A callback used by the function manager to populate all the defined functions.
 * Note that we are removing the 'main' function before returning
 * because we do not want the function manager to tweak anything on the 'main' function.
 * @returns {{main: {graph: *}}}
 */
function getCurrentContexts() {
    const localContexts = {
        ...contexts,
    }
    delete localContexts.main
    return localContexts
}

/**
 * Called when page is loaded.
 * and also whenever the user defined functions are added or deleted.
 */
function updateContextsDropdown() {
    $('#currentContext option').remove()
    const contextsDropdown = $('#currentContext')
    Object.keys(contexts).forEach((context) => {
        contextsDropdown.append($('<option />').val(context).text(context))
    })
    contextsDropdown.val(currentContextName)
}

/**
 * Utility function to add start and end block for the current graph object
 * with the text suffixed with the current context name.
 * @param {string} context
 * @return start
 */
function addStartAndEndBlock(context) {
    const link = new joint.shapes.standard.Link()
    const parametersAndReturnType = getParametersAndReturnType(context)

    let start = new joint.shapes.standard.Rectangle()
    start.position(350, 30)
    start.resize(150, 60)
    start.attr({
        element: {
            type: 'start',
        },
        outgoing_link: {
            next: link.id,
        },
        body: {
            fill: '#E74C3C',
            rx: 20,
            ry: 20,
            strokeWidth: 0,
        },
        label: {
            text: getWrapText(
                `Start ${context}(${parametersAndReturnType.parameters})`
            ),
            fill: '#ECF0F1',
        },
    })
    start.addTo(graph)

    const end = start.clone()

    end.attr({
        label: {
            text: getWrapText(parametersAndReturnType.returnType),
        },
        element: {
            type: 'end',
        },
        outgoing_link: null,
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
        },
    })
    return start
}

/**
 * Registering the service worker for PWA capabilities
 * whenever we are NOT in development mode
 */
window.onload = () => {
    'use strict'

    if (location.hostname !== 'localhost' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
    }
}
