const strokeHigh = 5
let strokeLow = 0

async function delay_loop(currentElement) {
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
            case 'assignment' :
                await handleAssignment(currentElement)
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

async function handleAssignment(element) {
    let type, obj, arrayNotation
    const variableName = element.attr('element/variableName')
    let variableValue = element.attr('element/variableValue')
    if (!variableName) {
        throw new Error('Assign a variable name')
    }
    if (!variableValue) {
        throw new Error("Assign a variable value")
    }
    if (isArrayNotation(variableName)) {
        arrayNotation = variableName.split('[')
    }
    obj = getDeclaredVariable(variableName, arrayNotation)
    type = obj.type
    if (type === 'int') {
        variableValue = parseInt(globalEval(variableValue))
        globalEval(variableName + ' = ' + variableValue)
    } else if (type === 'float') {
        variableValue = parseFloat(globalEval(variableValue))
        globalEval(variableName + ' = ' + variableValue)
    } else if (type === 'char' && isChar(variableValue)) {
        globalEval(variableName + ' = ' + '\'' + variableValue + '\'')
    } else if (type === 'string') {
        variableValue = handleArrays(variableValue, isChar, parseChar, variableName, 'string', false)
    } else if (type === 'int(array)') {
        variableValue = handleArrays(variableValue, isInteger, parseInt, variableName, 'integer', false)
    } else if (type === 'float(array)') {
        variableValue = handleArrays(variableValue, isFloat, parseFloat, variableName, 'float', false)
    } else if (type === 'char(array)') {
        variableValue = handleArrays(variableValue, isChar, parseChar, variableName, 'character', false)
    }
    storeVariables(variableName, arrayNotation, variableValue, type)
    return {status: "Ok"}
}

async function handleDeclaration(element) {
    let types = {
        'Integer': 'int',
        'Float': 'float',
        'Char': 'char',
        'String': 'string',
        'Integer array': 'int(array)',
        'Float array': 'float(array)',
        'Char array': 'char(array)'
    }
    const type = types[element.attr('element/variableType')]
    if (type.includes('array') || type.includes('string')) {
        globalEval(element.attr('element/variableName') + '= []')
        variables [element.attr('element/variableName')] = {
            type: type,
            value: []
        }
    } else {
        variables [element.attr('element/variableName')] = {
            type: type,
            value: null
        }
    }
}

async function handleInput(element) {
    let type, val, obj, arrayNotation
    const variableName = element.attr('element/variableName')
    if (!variableName) {
        throw new Error('Assign a variable name')
    }
    renderProgram('Enter the value for variable ' + variableName)
    if (isArrayNotation(variableName)) {
        arrayNotation = variableName.split('[')
    }
    obj = getDeclaredVariable(variableName, arrayNotation)
    type = obj.type
    const userInput = await allowUser()
    if (type === 'int' && isInteger(userInput) === true) {
        val = parseInt(userInput)
        globalEval(variableName + ' = ' + val)
    } else if (type === 'float' && isFloat(userInput) === true) {
        val = parseFloat(userInput)
        globalEval(variableName + ' = ' + val)
    } else if (type === 'char') {
        if (!isChar(userInput)) {
            throw new Error('Enter a Character')
        }
        val = userInput
        globalEval(variableName + ' = \'' + userInput + '\'')
    } else if (type === 'string') {
        val = handleArrays(userInput, isChar, parseChar, variableName, 'string', true)
    } else if (type === 'int(array)') {
        val = handleArrays(userInput, isInteger, parseInt, variableName, 'integer', true)
    } else if (type === 'float(array)') {
        val = handleArrays(userInput, isFloat, parseFloat, variableName, 'float', true)
    } else if (type === 'char(array)') {
        val = handleArrays(userInput, isChar, parseChar, variableName, 'character', true)
    } else {
        throw new Error('Data type mismatch.')
    }
    storeVariables(variableName, arrayNotation, val, type)
    return {status: "Ok"}
}

async function handleOutput(element) {
    if (!element.attr('element/expression')) {
        throw new Error('Assign a Expression')
    }
    renderProgram(globalEval(element.attr('element/expression')))
    return {status: 'Ok'}
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

function isFloat(n) {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        return !!n.includes('.')
    }
    return false
}

function isInteger(n) {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        return !n.includes('.')
    }
    return false
}

function isChar(n) {
    return n.length === 1;

}

function parseChar(n) {
    return '\'' + n + '\''
}

function isArrayNotation(n) {
    return !!(n.includes('[') && n.includes(']'));
}

function getDeclaredVariable(variableName, arrayNotation) {
    let obj
    if (isArrayNotation(variableName)) {
        arrayNotation = variableName.split('[')
        if (!(arrayNotation[0] in variables)) {
            throw new Error('Declare the variable before using it.')
        }
        obj = variables[arrayNotation[0]]
    } else if (!(variableName in variables)) {
        throw new Error('Declare the variable before using it.')
    } else {
        obj = variables[variableName]
    }
    return obj
}

function storeVariables(variableName, arrayNotation, variableValue, type) {
    if (isArrayNotation(variableName)) {
        //Extracting the index position from the array notation
        const indexPosition = arrayNotation[1].split(']')
        variables[arrayNotation[0]].type = type
        variables[arrayNotation[0]].value[parseInt(indexPosition[0])] = variableValue
    } else {
        variables[variableName] = {
            type: type,
            value: variableValue
        }
    }
}

function handleArrayAssignment(userInput, type) {
    if (type === 'character' || type === 'string') {
        if (isArrayNotation(userInput)) {
            return globalEval(userInput)
        } else {
            return userInput
        }
    } else {
        return globalEval(userInput).toString()
    }
}

function handleArrays(userInput, checkType, parsingType, variableName, type, isInput) {
    let val
    if (isArrayNotation(variableName)) {
        if ((isInput) ? checkType(userInput) : checkType(handleArrayAssignment(userInput, type))) {
            val = (isInput) ? parsingType(userInput) : parsingType(handleArrayAssignment(userInput, type))
            globalEval(variableName + '=' + val)
        } else {
            throw new Error('Data type mismatch. Declared array is of type ' + type + '.')
        }
    } else {
        if (type === 'string') {
            val = userInput.split('')
        } else {
            val = userInput.split(',')
        }
        for (let i = 0; i < val.length; i++) {
            if (checkType(val[i])) {
                val[i] = parsingType(val[i])
            } else {
                throw new Error('Data type mismatch.\n\nDeclared array is of type ' + type + ' but value at position '
                    + (i + 1) + ' in the array is not of type ' + type + '.')
            }
        }
        globalEval(variableName + '=[' + val + ']')
    }
    return val
}
