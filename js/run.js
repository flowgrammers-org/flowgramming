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
let paused = false,
    stopped = false

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
            while (paused) {
                if (currentElement.attr('body/fill') !== strokeHigh.color) {
                    currentElement.attr('body/stroke', strokeHigh.color)
                }
                if (stopped) break
                await sleep(10)
            }
            currentElement.attr('body/strokeWidth', strokeLow.width)
            currentElement.attr('body/stroke', strokeLow.color)
            if (stopped) break
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
                Object.keys(variables).forEach((varName) => {
                    const varValue = variables[varName].value
                    if (varValue) {
                        handleAssignmentHelper(varName, varValue.toString())
                    } else {
                        handleNullAssignment(varName, variables[varName].type)
                    }
                })
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
    let variableArray = element.attr('element/variableArray')
    let variableType = element.attr('element/variableType')
    let arrayLength = element.attr('element/arrayLength')
    let rowLen = element.attr('element/rowLen')
    let colLen = element.attr('element/colLen')
    let is2DArray = element.attr('element/is2DArray')
    if (variableArray.length > 1) {
        for (let i = 0; i < variableArray.length; i++) {
            handleDeclarationHelper(
                variableArray[i],
                variableType,
                arrayLength,
                rowLen,
                colLen,
                is2DArray
            )
        }
    } else {
        handleDeclarationHelper(
            element.attr('element/variableName'),
            variableType,
            arrayLength,
            rowLen,
            colLen,
            is2DArray
        )
    }
}

function initializeArray(len) {
    let value = []
    for (let i = 0; i < len; i++) {
        value.push('N/A')
    }
    return value
}

function handleDeclarationHelper(
    variableName,
    variableType,
    arrayLength,
    rowLen,
    colLen,
    is2DArray
) {
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
        let value = []
        if (is2DArray) {
            for (let i = 0; i < rowLen; i++) {
                let row = initializeArray(colLen)
                value.push(row)
            }
        } else {
            value = initializeArray(arrayLength)
        }
        variables[variableName] = {
            type: type,
            value,
            arrayLength,
            rowLen,
            colLen,
            is2DArray,
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

function handleNullAssignment(variableName, type) {
    variables[variableName] = {
        type,
        value: null,
    }
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
    let { type, arrayLength, rowLen, colLen, is2DArray } = getDeclaredVariable(
        variableName,
        arrayNotation
    )
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
                } else{
                    throw new Error('Datatype mismatch')
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
                arrayLength,
                rowLen,
                colLen,
                is2DArray
            )
        } else if (type === 'float(array)') {
            variableValue = handleArrays(
                variableValue,
                isFloat,
                parseFloat,
                variableName,
                'float',
                false,
                arrayLength,
                rowLen,
                colLen,
                is2DArray
            )
        } else if (type === 'char(array)') {
            variableValue = handleArrays(
                variableValue,
                isChar,
                parseChar,
                variableName,
                'character',
                false,
                arrayLength,
                rowLen,
                colLen,
                is2DArray
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
    let { type, arrayLength, rowLen, colLen, is2DArray } = getDeclaredVariable(
        variableName,
        arrayNotation
    )

    const userInput = await allowUser()
    if (userInput === 'Stopped') return
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
            arrayLength,
            rowLen,
            colLen,
            is2DArray
        )
    } else if (type === 'float(array)') {
        val = handleArrays(
            userInput,
            isFloat,
            parseFloat,
            variableName,
            'float',
            true,
            arrayLength,
            rowLen,
            colLen,
            is2DArray
        )
    } else if (type === 'char(array)') {
        val = handleArrays(
            userInput,
            isChar,
            parseChar,
            variableName,
            'character',
            true,
            arrayLength,
            rowLen,
            colLen,
            is2DArray
        )
    } else {
        throw new Error(
            'Data type mismatch\n\nDeclared variable is of type ' + type
        )
    }
    storeVariables(variableName, arrayNotation, val, type)
    return { status: 'Ok' }
}

function twoDArrayToString(a) {
    let row = ''
    for (let i = 0; i < a.length; i++) {
        row += '[' + a[i] + '],'
    }
    return row.slice(0, -1)
}

async function handleOutput(element) {
    if (!element.attr('element/expression')) {
        throw new Error('Assign a Expression')
    }
    handleRuntimeErrors(element.attr('element/expression'))
    try {
        let exp = element.attr('element/expression')
        if (isArrayNotation(exp)) {
            let arrayNotation = exp.split('[')
            let i = arrayNotation[1].split(']')[0]
            if (i >= variables[arrayNotation[0]].rowLen)
                throw new Error("The specified row doesn't exist in the array")
            let expr = variables[arrayNotation[0]].value[i]
            if (arrayNotation.length > 2) {
                let j = arrayNotation[2].split(']')[0]
                if (j >= variables[arrayNotation[0]].colLen)
                    throw new Error(
                        "The specified column doesn't exist in the array"
                    )
                expr = variables[arrayNotation[0]].value[i][j]
            }
            renderProgram(expr || 'N/A')
        } else {
            if (exp in variables) {
                exp = variables[exp]
                let val = exp.value
                if (exp.is2DArray) val = twoDArrayToString(val)
                renderProgram(val)
            } else {
                renderProgram(globalEval(exp))
            }
        }
    } catch (e) {
        handleNotInitializedVariables(e)
    }
    return { status: 'Ok' }
}

async function handleForLoop(element) {
    try {
        const incrExp = element.attr('element/forLoop/incr')
        if (!visitedItems.has(element.id)) {
            const initExp = element.attr('element/forLoop/init')
            if (!initExp) {
                throw new Error('Enter the initialisation expression')
            }
            let vn = initExp.split('=')[0].trim()
            if (vn in variables) {
                variables[vn].value = globalEval(initExp)
            }
        } else {
            if (!incrExp) {
                throw new Error('Enter the incrementation expression')
            }
            handleRuntimeErrors(incrExp)
            let vn = incrExp.match(/[a-zA-z]*/)[0]
            if (vn in variables) {
                globalEval(incrExp)
                variables[vn].value = globalEval(vn)
            }
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

function clearAll() {
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
}

async function run() {
    clearAll()
    stopped = false
    paused = false
    await delayLoop(start)
    $('#stop-btn').addClass('hidden')
    $('#pause-btn').addClass('hidden')
    $('#run-btn').removeClass('hidden')
}

async function pause() {
    paused = true
    $('#pause-btn').addClass('hidden')
    $('#play-btn').removeClass('hidden')
}

async function play() {
    paused = false
    $('#play-btn').addClass('hidden')
    $('#pause-btn').removeClass('hidden')
}

async function stopRun() {
    stopped = true
    clearAll()
    updateVariablesInWatchWindow()
    $('#stop-btn').addClass('hidden')
    $('#pause-btn').addClass('hidden')
    $('#play-btn').addClass('hidden')
    $('#run-btn').removeClass('hidden')
}

function isFloat(n) {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        return !!n.includes('.')
    }
    return false
}

function isInteger(n) {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        return !n.toString().includes('.')
    }
    return false
}

function isChar(n) {
    return n.length === 1
}

function parseChar(n) {
    if (n[0] === '"' && n[n.length - 1] === '"') n = n.slice(1, -1)
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
        variables[arrayNotation[0]].type = type
        let indexPosition = arrayNotation[1].split(']')[0]
        if (!isInteger(indexPosition)) {
            indexPosition = globalEval(indexPosition)
        }
        //Extracting the index position from the array notation
        if (arrayNotation.length > 2) {
            let indexJ = arrayNotation[2].split(']')[0]
            if (!isInteger(indexJ)) indexJ = globalEval(indexJ)
            variables[arrayNotation[0]].value[parseInt(indexPosition)][
                parseInt(indexJ)
            ] = variableValue
        } else
            variables[arrayNotation[0]].value[
                parseInt(indexPosition)
            ] = variableValue
    } else {
        variables[variableName] = {
            ...variables[variableName],
            type,
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
            if (
                isArrayNotation(userInput) &&
                userInput.split('[')[0] in variables
            ) {
                let arrayNotation = userInput.split('[')
                let i = globalEval(arrayNotation[1].split(']')[0])
                let val = variables[arrayNotation[0]].value[i]
                if (arrayNotation.length > 2) {
                    let j = globalEval(arrayNotation[2].split(']')[0])
                    val = variables[arrayNotation[0]].value[i][j]
                }
                return val
            } else return globalEval(userInput).toString()
        }
    } catch (e) {
        handleNotInitializedVariables(e)
    }
}

function handle1Darrays(type, userInput, checkType, variableName, parsingType) {
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

    let val = userInput.split(',')
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
    return val
}

function handleArrays(
    userInput,
    checkType,
    parsingType,
    variableName,
    type,
    isInput,
    arrayLength,
    rowLen,
    colLen,
    is2DArray
) {
    let val

    try {
        let arrayNotation = variableName.split('[')
        if (isArrayNotation(variableName)) {
            if (stringManipulationRegex.test(userInput)) {
                val = stringManipulations(variableName, userInput)
                return val
            }
            let typeCheck
            if (
                is2DArray &&
                parseInt(arrayNotation[1].split(']')[0]) >= parseInt(rowLen)
            )
                throw new Error(
                    'The specified length of array cannot hold these many values'
                )
            if (is2DArray && arrayNotation.length < 3) {
                val = handle1Darrays(
                    type,
                    userInput,
                    checkType,
                    variableName,
                    parsingType
                )
            } else {
                if (is2DArray && userInput.includes(','))
                    throw new Error(
                        "Array can't be assigned to " + type.split(' ')[0]
                    )
                if (
                    is2DArray &&
                    parseInt(arrayNotation[2].split(']')[0]) >= parseInt(colLen)
                )
                    throw new Error(
                        'The specified number of columns of the array cannot hold these many values'
                    )
                if (isInput) {
                    typeCheck = checkType(userInput)
                    val = parsingType(userInput)
                } else {
                    let v = handleArrayAssignment(userInput, type)
                    typeCheck = checkType(v)
                    val = parsingType(handleArrayAssignment(userInput, type))
                }
                if (typeCheck) {
                    globalEval(arrayNotation[0] + '=' + val)
                } else {
                    throw new Error(
                        'Data type mismatch\n\nDeclared array is of type ' +
                            type
                    )
                }
            }
        } else {
            if (stringManipulationRegex.test(userInput)) {
                val = stringManipulations(variableName, userInput)
                return val
            }
            if (is2DArray && !userInput.includes(';')) {
                userInput = userInput.replaceAll('],', '];')
            }
            val = userInput.split(';')
            if (is2DArray) {
                for (let i = 0; i < val.length; i++) {
                    let x = val[i]
                    if (
                        (x[0] === '[' || x[0] === '(' || x[0] === '{') &&
                        (x[x.length - 1] === ']' ||
                            x[x.length - 1] === ')' ||
                            x[x.length - 1] === '}')
                    )
                        x = val[i].slice(1, -1)
                    x = handle1Darrays(
                        type,
                        x,
                        checkType,
                        variableName,
                        parsingType
                    )
                    if (x.length > parseInt(colLen)) {
                        throw new Error(
                            'The specified number of columns of the array cannot hold these many values'
                        )
                    }
                    val[i] = x
                }
            } else {
                val = handle1Darrays(
                    type,
                    userInput,
                    checkType,
                    variableName,
                    parsingType
                )
            }
            globalEval(variableName + '=[' + val + ']')
        }

        if (
            (!is2DArray && val.length > parseInt(arrayLength)) ||
            (is2DArray &&
                val.length > parseInt(rowLen) &&
                !isArrayNotation(variableName))
        ) {
            throw new Error(
                ' The specified length of array cannot hold these many values'
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
    let regExp = /\(([^)]+)\)/;
    let parametersAsString = regExp.exec(userInput);
   // let parametersAsString = userInput.match(/\(([^)]+)\)/)
   //let parametersAsString = userInput.match(/\((.*?)\)/g)
    if (userInput.includes('strcat')) {
        let parameters = parametersAsString[1].split(',')
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
        let parameters = parametersAsString[1].split(',')
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
        let variable = parametersAsString[1]
        if (variableName === '') {
            return globalEval(variable + '.length')
        }
        return globalEval(variableName + '=' + variable + '.length')
    } else if (userInput.includes('toAscii')) {
        let variable = parametersAsString[1]
        return globalEval(variableName + '=' + variable + '.codePointAt(0)')
    } else if (userInput.includes('toChar')) {
        let variable = parametersAsString[1]
        return globalEval(
            variableName + '= String.fromCharCode(' + variable + ')'
        )
    } else if (userInput.includes('toUpperCase')) {
        let variable = parametersAsString[1]
        if (isArrayNotation(variable) || variables[variable].type === 'char') {
            return globalEval(variableName + '='+ variable+'.toUpperCase()')
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
        let variable = parametersAsString[1]
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
