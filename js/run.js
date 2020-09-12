const strokeHigh = 5
let strokeLow = 0
const visitedItems = new Set()

async function delayLoop(currentElement) {
    const delay = 1000

    strokeLow = currentElement.attr('body/strokeWidth')
    currentElement.attr('body/strokeWidth', strokeHigh)

    let expressionResult = false
    try {
        switch (currentElement.attr('element/type')) {
            case 'input' :
                await handleInput(currentElement)
                break
            case 'output' :
                await handleOutput(currentElement)
                break
            case 'if' :
                expressionResult = await handleBooleanExpression(currentElement)
                break
            case 'while' :
                switch (currentElement.attr('element/loopType')) {
                    case 'while' :
                        expressionResult = await handleBooleanExpression(currentElement)
                        break
                    case 'for' :
                        expressionResult = await handleForLoop(currentElement)
                        break
                }
                break
            case 'declare' :
                await handleDeclaration(currentElement)
                break
            case 'assignment' :
                await handleAssignment(currentElement)
                break
        }
        visitedItems.add(currentElement.id)

        // This is to handle an edge case where a for-loop comes inside another loop.
        // In that case, we would want to execute the for-loop's initialisation statements again.
        // Hence, deleting the element from the HashSet.
        if (!expressionResult) {
            visitedItems.delete(currentElement.id)
        }

        setTimeout(function () {
            currentElement.attr('body/strokeWidth', strokeLow)
            if (currentElement.attr('outgoing_link')) {
                let currentLink
                const currentElementType = currentElement.attr('element/type');
                if (['if', 'while'].includes(currentElementType)) {
                    currentLink = getConditionalNextLink(currentElement, currentElementType, expressionResult)
                } else {
                    currentLink = findModel(currentElement.attr('outgoing_link/next'))
                }
                currentElement = findModel(currentLink.attr('element/target'))
                delayLoop(currentElement)
            }
        }, delay)
    } catch (err) {
        alert(err.toString())
        currentElement.attr('body/strokeWidth', strokeLow)
        currentElement = null
    }
}

function getConditionalNextLink(ele, elementType, expResult) {
    const links = {
        'if': ['outgoing_link/falseLink', 'outgoing_link/trueLink'],
        'while': ['outgoing_link/next', 'outgoing_link/loopLink']
    }
    return findModel(ele.attr(links[elementType][Number(expResult)]))
}

async function handleForLoop(element) {
    try {
        if (!visitedItems.has(element.id)) {
            const initExp = element.attr('element/forLoop/init')
            if (!initExp) {
                throw new Error('Enter the initialisation expression')
            }
            globalEval(initExp)
        } else {
            const incrExp = element.attr('element/forLoop/incr')
            if (!incrExp) {
                throw new Error('Enter the incrementation expression')
            }
            handleRuntimeErrors(incrExp)
            globalEval(incrExp)
        }
    } catch (e) {
        handleNotInitializedVariables(e)
    }
    return handleBooleanExpression(element)
}

async function handleAssignment(element) {
    let type, obj, arrayNotation
    const variableName = element.attr('element/variableName')
    let variableValue = element.attr('element/variableValue')
    if (!variableName) {
        throw new Error('Assign a variable name')
    }
    if (!variableValue) {
        throw new Error('Assign a variable value')
    }
    if (isArrayNotation(variableName)) {
        arrayNotation = variableName.split('[')
    }
    obj = getDeclaredVariable(variableName, arrayNotation)
    type = obj.type
    handleRuntimeErrors(variableValue)
    try {
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
    } catch (e) {
        handleNotInitializedVariables(e)
    }

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
    if (variables[element.attr('element/variableName')]) {
        throw new Error('Variable with the same name is already declared')
    }
    const type = types[element.attr('element/variableType')]
    if (type.includes('array') || type.includes('string')) {
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
        throw new Error('Assign a variable name to take input')
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
    } else if (type === 'char' && isChar(userInput)) {
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
        throw new Error('Data type mismatch\n\nDeclared variable is of type ' + type)
    }
    storeVariables(variableName, arrayNotation, val, type)
    return {status: "Ok"}

}

async function handleOutput(element) {
    if (!element.attr('element/expression')) {
        throw new Error('Assign a Expression')
    }
    handleRuntimeErrors(element.attr('element/expression'))
    try {
        renderProgram(globalEval(element.attr('element/expression')))
    } catch (e) {
        handleNotInitializedVariables(e)
    }
    return {status: 'Ok'}
}

async function handleBooleanExpression(element) {
    if (!element.attr('element/expression')) {
        throw new Error('Assign a Expression')
    }
    handleRuntimeErrors(element.attr('element/expression'))
    try {
        return !!globalEval(element.attr('element/expression'))
    } catch (e) {
        handleNotInitializedVariables(e)
    }
}


function run() {
    visitedItems.clear()
    delayLoop(start).then(() => variables = [])
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
            throw new Error('Declare the variable ' + arrayNotation[0] + ' before using it')
        }
        obj = variables[arrayNotation[0]]
    } else if (!(variableName in variables)) {
        throw new Error('Declare the variable ' + variableName + ' before using it')
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
    try {
        if (type === 'character' || type === 'string') {
            if (isArrayNotation(userInput)) {
                return globalEval(userInput)
            } else {
                return userInput
            }
        } else {
            return globalEval(userInput).toString()
        }
    } catch (e) {
        handleNotInitializedVariables(e)
    }
}

function handleArrays(userInput, checkType, parsingType, variableName, type, isInput) {
    let val
    try {
        if (isArrayNotation(variableName)) {
            let typeCheck
            if (isInput) {
                typeCheck = checkType(userInput)
                val = parsingType(userInput)
            } else {
                typeCheck = checkType(handleArrayAssignment(userInput,type))
                val = parsingType(handleArrayAssignment(userInput, type))
            }
            if (typeCheck) {
                globalEval(variableName + '=' + val)
            } else {
                throw new Error('Data type mismatch\n\nDeclared array is of type ' + type)
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
                    throw new Error('Data type mismatch\n\nDeclared array is of type ' + type + ' but value at position '
                        + (i + 1) + ' in the array is not of type ' + type)
                }
            }
            globalEval(variableName + '=[' + val + ']')
        }
        return val
    } catch (e) {
        handleNotInitializedVariables(e)
    }
}

function handleNotInitializedVariables(e) {
    const msg = e.message
    if (e instanceof ReferenceError) {
        const err = msg.split(' ')
        if (variables[err[0]]) {
            throw new Error(err[0] + ' is not initialised.\n\nInitialize the variable before using it')
        }
        throw new Error(err[0] + ' is not defined.\n\nDefine the variable before using it')
    } else if (e instanceof TypeError) {
        throw new Error('Undefined variable is used')
    }
    throw e.message
}

function handleRuntimeErrors(expression) {
    const regex = /[/][\s]*[0]/
    if (expression.search(regex) !== -1) {
        throw new Error('Variable divided by zero')
    }
}
