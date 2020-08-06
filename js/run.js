const strokeHigh = 5
let strokeLow = 0

async function delay_loop (currentElement) {
    const delay = 1000
    strokeLow = currentElement.attr('body/strokeWidth')
    currentElement.attr('body/strokeWidth', strokeHigh)
    let ifResult = false
    try {
        switch (currentElement.attr('element/type')) {
            case 'input' :
                await handleInput(currentElement)
                break
            case 'output' :
                await handleOutput(currentElement)
                break
            case 'if' :
                ifResult = await handleIf(currentElement)
                break
            case 'declare' :
                await handleDeclaration(currentElement)
                break
        }
        setTimeout(function () {
            currentElement.attr('body/strokeWidth', strokeLow)
            if (currentElement.attr('outgoing_link')) {
                let currentLink
                if (currentElement.attr('element/type') === 'if') {
                    if (ifResult) {
                        currentLink = findModel(currentElement.attr('outgoing_link/trueLink'))
                    } else {
                        currentLink = findModel(currentElement.attr('outgoing_link/falseLink'))
                    }
                } else {
                    currentLink = findModel(currentElement.attr('outgoing_link/next'))
                }
                currentElement = findModel(currentLink.attr('element/target'))
                delay_loop(currentElement)
            }
        }, delay)
    } catch (err) {
        alert(err.toString())
        currentElement.attr('body/strokeWidth', strokeLow)
        currentElement = null
    }
}

async function handleDeclaration(element) {
    let types = {
        'Integer': 'int',
        'Float': 'float',
        'Char': 'char',
        'String': 'string'
    }
    variables [element.attr('element/variableName')] = {
        type: types[element.attr('element/variableType')],
        value: null
    }
}

async function handleInput(element) {
    const variableName = element.attr('element/variableName')
    if (!variableName) {
        throw new Error('Assign a variable name')
    }
    renderProgram('Enter the value for variable ' + variableName)
    if (!(variableName in variables)) {
        throw new Error('Declare the variable before using it.')
    }
    const userInput = await allowUser()
    let type, val, obj
    obj = variables[variableName]
    type = obj.type
    if (type === 'int' && isInteger(userInput) === true) {
        val = parseInt(userInput)
        globalEval('var ' + variableName + ' = ' + 'parseInt(' + userInput + ');')
    } else if (type === 'float' && isFloat(userInput) === true) {
        val = parseFloat(userInput)
        globalEval('var ' + variableName + ' = ' + 'parseFloat(' + userInput + ');')
    } else if (type === 'char') {
        if (userInput.length > 1) {
            throw new Error('Enter a Character')
        }
        val = userInput
        globalEval('var ' + variableName + ' = \'' + userInput + '\';')
    } else if (type === 'string') {
        val = userInput
        globalEval('var ' + variableName + ' = \'' + userInput + '\';')
    } else {
        throw new Error('Data type mismatch.')
    }
    variables[variableName] = {
        type: type,
        value: val
    }
    return { status: "Ok" };
}

async function handleOutput(element) {
    if (!element.attr('element/expression')) {
        throw new Error('Assign a Expression')
    }
    renderProgram(globalEval(element.attr('element/expression')))
    return { status: 'Ok' }
}

async function handleIf(element) {
    if (!element.attr('element/expression')) {
        throw new Error('Assign a Expression')
    }
    return !!globalEval(element.attr('element/expression'))
}


function run() {
    delay_loop(start).then(() => variables = [])
    clearChat()
}

function isFloat (n) {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        return !!n.includes('.')
    }
    return false
}

function isInteger (n) {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        return !n.includes('.')
    }
    return false
}
