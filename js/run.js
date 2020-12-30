let strokeLow = {
    width: 0,
    color: 'black',
}
const strokeHigh = {
    width: 5,
    color: '#E74C3C',
}
let visitedItems = new Set()
const stringManipulationRegex = /(([a-zA-Z]+)|([a-zA-Z]+\.[a-zA-Z]+))\(([a-zA-Z0-9]|,|]|\[|')+\)/
// The HashMap that sets the delay in milliseconds after processing each block
// in the flowgram. However, in case the speed is not stored in localStorage,
// we set the speed to 'medium' in the dropdown in index.html. To support that,
// we are mapping undefined to the same speed as 'medium'
const speedToDelayMapping = {
    slow: 1500,
    medium: 1000,
    undefined: 1000,
    fast: 500,
}

let variablesStack = [],
    previousContextStack = [],
    previousContextModelStack = [],
    visitedItemsStack = [],
    functionReturnVariablesStack = []

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function delayLoop(currentElement) {
    while (true) {
        // Let's get the delay in ms according to the speed stored in localStorage
        const delay = speedToDelayMapping[speedOfExecutionDropdown.val()]

        strokeLow.width = currentElement.attr('body/strokeWidth')
        currentElement.attr('body/strokeWidth', strokeHigh.width)
        if (currentElement.attr('body/fill') !== strokeHigh.color) {
            currentElement.attr('body/stroke', strokeHigh.color)
        }

        let expressionResult = false
        try {
            switch (currentElement.attr('element/type')) {
                case 'input':
                    await handleInput(currentElement)
                    break
                case 'output':
                    await handleOutput(currentElement)
                    break
                case 'if':
                case 'doWhileExpr':
                    expressionResult = await handleBooleanExpression(
                        currentElement
                    )
                    break
                case 'while':
                    switch (currentElement.attr('element/loopType')) {
                        case 'while':
                            expressionResult = await handleBooleanExpression(
                                currentElement
                            )
                            break
                        case 'for':
                            expressionResult = await handleForLoop(
                                currentElement
                            )
                            break
                    }
                    break
                case 'declare':
                    await handleDeclaration(currentElement)
                    break
                case 'assignment':
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

            updateVariablesInWatchWindow()

            await sleep(delay)
            currentElement.attr('body/strokeWidth', strokeLow.width)
            currentElement.attr('body/stroke', strokeLow.color)

            if (
                currentElement.attr('element/type') === 'end' &&
                previousContextStack.length
            ) {
                currentElement = previousContextModelStack.pop()
                let returnValue
                if (functionReturnVariablesStack.length) {
                    const { value, type } = variables[
                        contexts[currentContextName].returnVariable
                    ]
                    returnValue = value
                    if (type !== contexts[currentContextName].returnType) {
                        throw new Error(
                            "Return type does not match the returned variable's type"
                        )
                    }
                }
                variables = {
                    ...variablesStack.pop(),
                }
                visitedItems = new Set(visitedItemsStack.pop())
                if (
                    previousContextStack[previousContextStack.length - 1] !==
                    currentContextName
                ) {
                    $('#currentContext').val(previousContextStack.pop())
                    switchContext()
                } else {
                    previousContextStack.pop()
                }

                if (functionReturnVariablesStack.length) {
                    let variableName = functionReturnVariablesStack.pop()
                    let variableValue = returnValue.toString()
                    handleAssignmentHelper(variableName, variableValue)
                }
                continue
            }
            if (currentElement.attr('element/type') === 'function') {
                const functionName = currentElement.attr('element/functionName')
                const returnVariable = currentElement.attr(
                    'element/functionVariable'
                )
                const functionParams = currentElement.attr(
                    'element/functionParams'
                )

                if (returnVariable) {
                    functionReturnVariablesStack.push(returnVariable)
                }

                let actualToFormalParamsMap = new Map()
                let prevVariablesCopy
                if (functionParams) {
                    prevVariablesCopy = {
                        ...variables,
                    }
                    const paramsLength =
                        contexts[functionName].parameters.length
                    const formalParamKeys = contexts[functionName].parameters
                    const actualParamKeys = functionParams.split(',')
                    for (let idx = 0; idx < paramsLength; ++idx) {
                        actualToFormalParamsMap.set(
                            formalParamKeys[idx].variableName,
                            actualParamKeys[idx]
                        )
                    }
                }

                variablesStack.push({ ...variables })

                visitedItemsStack.push(new Set(visitedItems))
                previousContextStack.push(currentContextName)
                const currentLink = findModel(
                    currentElement.attr('outgoing_link/next')
                )
                previousContextModelStack.push(
                    findModel(currentLink.attr('element/target'))
                )
                variables = []
                visitedItems.clear()
                if (currentContextName !== functionName) {
                    $('#currentContext').val(functionName)
                    switchContext()
                }

                if (functionParams) {
                    contexts[functionName].parameters.forEach((it) => {
                        handleDeclarationHelper(
                            it.variableName,
                            it.variableType
                        )
                        handleAssignmentHelper(
                            it.variableName,
                            globalEval(
                                actualToFormalParamsMap.get(it.variableName)
                            ).toString()
                        )
                    })
                }

                currentElement = findModel(contexts[functionName].start.id)
                continue
            }
            if (currentElement.attr('outgoing_link')) {
                let currentLink
                const currentElementType = currentElement.attr('element/type')
                if (
                    ['if', 'while', 'doWhileExpr'].includes(currentElementType)
                ) {
                    currentLink = getConditionalNextLink(
                        currentElement,
                        currentElementType,
                        expressionResult
                    )
                } else {
                    currentLink = findModel(
                        currentElement.attr('outgoing_link/next')
                    )
                }
                currentElement = findModel(currentLink.attr('element/target'))
            } else {
                break
            }
        } catch (err) {
            swal(err.message || err.toString())
            currentElement.attr('body/strokeWidth', strokeLow.width)
            currentElement.attr('body/stroke', strokeLow.color)
            currentElement = null
            break
        }
    }
}

function getConditionalNextLink(ele, elementType, expResult) {
    const links = {
        if: ['outgoing_link/falseLink', 'outgoing_link/trueLink'],
        while: ['outgoing_link/next', 'outgoing_link/loopLink'],
        doWhileExpr: ['outgoing_link/next', 'outgoing_link/loopLink'],
    }
    return findModel(ele.attr(links[elementType][Number(expResult)]))
}

async function handleDeclaration(element) {
    handleDeclarationHelper(
        element.attr('element/variableName'),
        element.attr('element/variableType'),
        element.attr('element/arrayLength')
    )
}

function handleDeclarationHelper(variableName, variableType, arrayLength) {
    let types = {
        Integer: 'int',
        Float: 'float',
        Char: 'char',
        'Integer array': 'int(array)',
        'Float array': 'float(array)',
        'Char array': 'char(array)',
    }
    if (variables[variableName]) {
        throw new Error('Variable with the same name is already declared')
    }
    const type = types[variableType]
    if (type.includes('array')) {
        variables[variableName] = {
            type: type,
            value: [],
            arrayLength,
        }
    } else {
        variables[variableName] = {
            type: type,
            value: null,
        }
    }
}

async function handleAssignment(element) {
    const variableName = element.attr('element/variableName')
    let variableValue = element.attr('element/variableValue')
    handleAssignmentHelper(variableName, variableValue)
    return { status: 'Ok' }
}

function handleAssignmentHelper(variableName, variableValue) {
    let arrayNotation
    if (!variableName) {
        throw new Error('Assign a variable name')
    }
    if (!variableValue) {
        throw new Error('Assign a variable value')
    }
    if (isArrayNotation(variableName)) {
        arrayNotation = variableName.split('[')
    }
    let { type, arrayLength } = getDeclaredVariable(variableName, arrayNotation)
    handleRuntimeErrors(variableValue)
    try {
        if (type === 'int') {
            if (stringManipulationRegex.test(variableValue)) {
                variableValue = parseInt(
                    stringManipulations(variableName, variableValue)
                )
            } else {
                variableValue = parseInt(globalEval(variableValue))
                globalEval(variableName + ' = ' + variableValue)
            }
        } else if (type === 'float') {
            variableValue = parseFloat(globalEval(variableValue))
            globalEval(variableName + ' = ' + variableValue)
        } else if (type === 'char') {
            if (stringManipulationRegex.test(variableValue)) {
                variableValue = stringManipulations(variableName, variableValue)
            } else {
                if (isChar(variableValue)) {
                    globalEval(variableName + ' = ' + "'" + variableValue + "'")
                }
            }
        } else if (type === 'int(array)') {
            variableValue = handleArrays(
                variableValue,
                isInteger,
                parseInt,
                variableName,
                'integer',
                false,
                arrayLength
            )
        } else if (type === 'float(array)') {
            variableValue = handleArrays(
                variableValue,
                isFloat,
                parseFloat,
                variableName,
                'float',
                false,
                arrayLength
            )
        } else if (type === 'char(array)') {
            variableValue = handleArrays(
                variableValue,
                isChar,
                parseChar,
                variableName,
                'character',
                false,
                arrayLength
            )
        }
        storeVariables(variableName, arrayNotation, variableValue, type)
    } catch (e) {
        handleNotInitializedVariables(e)
    }
}

async function handleInput(element) {
    let val, arrayNotation
    const variableName = element.attr('element/variableName')
    if (!variableName) {
        throw new Error('Assign a variable name to take input')
    }
    renderProgram('Enter the value for variable ' + variableName)
    if (isArrayNotation(variableName)) {
        arrayNotation = variableName.split('[')
    }
    let { type, arrayLength } = getDeclaredVariable(variableName, arrayNotation)
    const userInput = await allowUser()
    if (type === 'int' && isInteger(userInput) === true) {
        val = parseInt(userInput)
        globalEval(variableName + ' = ' + val)
    } else if (type === 'float' && isFloat(userInput) === true) {
        val = parseFloat(userInput)
        globalEval(variableName + ' = ' + val)
    } else if (type === 'char' && isChar(userInput)) {
        val = userInput
        globalEval(variableName + " = '" + userInput + "'")
    } else if (type === 'int(array)') {
        val = handleArrays(
            userInput,
            isInteger,
            parseInt,
            variableName,
            'integer',
            true,
            arrayLength
        )
    } else if (type === 'float(array)') {
        val = handleArrays(
            userInput,
            isFloat,
            parseFloat,
            variableName,
            'float',
            true,
            arrayLength
        )
    } else if (type === 'char(array)') {
        val = handleArrays(
            userInput,
            isChar,
            parseChar,
            variableName,
            'character',
            true,
            arrayLength
        )
    } else {
        throw new Error(
            'Data type mismatch\n\nDeclared variable is of type ' + type
        )
    }
    storeVariables(variableName, arrayNotation, val, type)
    return { status: 'Ok' }
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
    return { status: 'Ok' }
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

async function run() {
    visitedItems.clear()
    variables = []
    variablesStack = []
    visitedItemsStack = []
    previousContextStack = []
    previousContextModelStack = []
    if (currentContextName !== 'main') {
        $('#currentContext').val('main')
        switchContext()
    }
    start = findModel(contexts[currentContextName].start.id)
    clearChat()
    await delayLoop(start)
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
    return n.length === 1
}

function parseChar(n) {
    return "'" + n + "'"
}

function isArrayNotation(n) {
    return !!(n.includes('[') && n.includes(']'))
}

function getDeclaredVariable(variableName, arrayNotation) {
    let obj
    if (isArrayNotation(variableName)) {
        arrayNotation = variableName.split('[')
        if (!(arrayNotation[0] in variables)) {
            throw new Error(
                'Declare the variable ' + arrayNotation[0] + ' before using it'
            )
        }
        obj = variables[arrayNotation[0]]
    } else if (!(variableName in variables)) {
        throw new Error(
            'Declare the variable ' + variableName + ' before using it'
        )
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
        variables[arrayNotation[0]].value[
            parseInt(indexPosition[0])
        ] = variableValue
    } else {
        variables[variableName] = {
            type: type,
            value: variableValue,
        }
    }
}

function handleArrayAssignment(userInput, type) {
    try {
        if (type === 'character') {
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

function handleArrays(
    userInput,
    checkType,
    parsingType,
    variableName,
    type,
    isInput,
    arrayLength
) {
    let val
    try {
        if (isArrayNotation(variableName)) {
            if (stringManipulationRegex.test(userInput)) {
                val = stringManipulations(variableName, userInput)
                return val
            }
            let typeCheck
            if (isInput) {
                typeCheck = checkType(userInput)
                val = parsingType(userInput)
            } else {
                typeCheck = checkType(handleArrayAssignment(userInput, type))
                val = parsingType(handleArrayAssignment(userInput, type))
            }
            if (typeCheck) {
                globalEval(variableName + '=' + val)
            } else {
                throw new Error(
                    'Data type mismatch\n\nDeclared array is of type ' + type
                )
            }
        } else {
            if (stringManipulationRegex.test(userInput)) {
                val = stringManipulations(variableName, userInput)
                return val
            }

            if (type === 'character' && userInput.search(',') === -1) {
                let temp = [...userInput]
                if (
                    (temp[0] == "'" && temp[temp.length - 1] == "'") ||
                    (temp[0] == '"' && temp[temp.length - 1] == '"')
                ) {
                    temp.pop()
                    temp.shift()
                    userInput = temp.toString()
                }
            }
            val = userInput.split(',')
            for (let i = 0; i < val.length; i++) {
                if (checkType(val[i])) {
                    val[i] = parsingType(val[i])
                } else {
                    throw new Error(
                        'Data type mismatch\n\nDeclared array ' +
                            variableName +
                            ' is of type ' +
                            type +
                            ' but value at position ' +
                            (i + 1) +
                            ' in the array is not of type ' +
                            type
                    )
                }
            }
            globalEval(variableName + '=[' + val + ']')
        }
        if (val.length !== parseInt(arrayLength)) {
            throw new Error(
                ' Length of array doesnt match with the given inputs '
            )
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
            throw new Error(
                err[0] +
                    ' is not initialised.\n\nInitialize the variable before using it'
            )
        }
        throw new Error(
            err[0] + ' is not defined.\n\nDefine the variable before using it'
        )
    } else if (e instanceof TypeError) {
        throw new Error('Undefined variable is used')
    }
    throw msg || e.toString()
}

function handleRuntimeErrors(expression) {
    const regex = /[/][\s]*[0]/
    if (expression.search(regex) !== -1) {
        throw new Error('Variable divided by zero')
    }
}

function stringManipulations(variableName, userInput) {
    let parametersAsString = userInput.match(/\((.*?)\)/g)
    if (userInput.includes('strcat')) {
        let parameters = parametersAsString[0].split(',')
        let firstVariable = parameters[0]
        let secondVariable = parameters[1]
        return globalEval(
            variableName +
                '= ' +
                firstVariable +
                '.concat(' +
                secondVariable +
                ')'
        )
    } else if (userInput.includes('substr')) {
        userInput = userInput.replace('substr', 'slice')
        return globalEval(variableName + '=' + userInput)
    } else if (userInput.includes('strcmp')) {
        let parameters = parametersAsString[0].split(',')
        let firstVariable = parameters[0]
        let secondVariable = parameters[1]
        if (
            JSON.stringify(globalEval(firstVariable)) ===
            JSON.stringify(globalEval(secondVariable))
        ) {
            globalEval(variableName + '=' + 0)
            return 0
        }
        globalEval(variableName + '=' + -1)
        return -1
    } else if (userInput.includes('strlen')) {
        let variable = parametersAsString[0]
        if (variableName === '') {
            return globalEval(variable + '.length')
        }
        return globalEval(variableName + '=' + variable + '.length')
    } else if (userInput.includes('toAscii')) {
        let variable = parametersAsString[0]
        return globalEval(variableName + '=' + variable + '.codePointAt(0)')
    } else if (userInput.includes('toChar')) {
        let variable = parametersAsString[0]
        return globalEval(
            variableName + '= String.fromCharCode(' + variable + ')'
        )
    } else if (userInput.includes('toUpperCase')) {
        let variable = parametersAsString[0]
        if (isArrayNotation(variable) || variables[variable].type === 'char') {
            return globalEval(variableName + '=' + variable + '.toUpperCase()')
        }
        return globalEval(
            variableName +
                '=' +
                variable +
                '.map(' +
                variable +
                ' => ' +
                variable +
                '.toUpperCase())'
        )
    } else if (userInput.includes('toLowerCase')) {
        let variable = parametersAsString[0]
        if (isArrayNotation(variable) || variables[variable].type === 'char') {
            return globalEval(variableName + '=' + variable + '.toLowerCase()')
        }
        return globalEval(
            variableName +
                '=' +
                variable +
                '.map(' +
                variable +
                ' => ' +
                variable +
                '.toLowerCase())'
        )
    }
}
