/*
 # *************************************************************************************
 # Copyright (C) 2021 Ritwik Murali, Harshit Agarwal, Rajkumar S, Sanjana G
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
let code
let indent = ''
let originalIndent = ''
let language = ''
let error = false
/**
 * Each language plugin must implement the functions:
 *      langHeaders: The header files to be added at the top of the code
 *      langFunctionDefinition: Function Prototype, given function name, return_type and parameters
 *      langInput: Given variable type and name
 *      langDeclaration: Given variable type and name
 *      langOutput: Given output expression
 *      langAssignment: Given variable name and value
 *      langBlockClose: Generic syntax for closing a block [Closing braces]
 *      langElseBlock: Must close if block before starting else
 *      langDoWhileLoopStart: Syntax for do block
 *      langDoWhileLoopClose: Closing do and syntax for while statement, given condition
 *      langFunctionCall: Given function name and parameter list
 *      langFunctionClose: Given return variable and type
 * where the prefix lang must be replaced with the language used
 */

let varArray = {}

function isArray(element) {
    try {
        return element.split(' ').length !== 1
    } catch (e) {
        return false
    }
}

function variableHelper(element, declare = false, varName = '') {
    let name = element.attr('element/variableName')
    if (varName !== '') name = varName
    if (declare || varArray[name] === undefined) {
        let type = isArray(element.attr('element/variableType'))
            ? element.attr('element/variableType').split(' ')[0]
            : element.attr('element/variableType')
        varArray[name] = {
            name,
            type,
        }
        isArray(element.attr('element/variableType'))
            ? (varArray[name] = {
                  ...varArray[name],
                  length: element.attr('element/arrayLength'),
                  isArray: true,
              })
            : null
    }
    return varArray[name]
}

function declarationHelper(element) {
    const variableArray = element.attr('element/variableArray')
    if (variableArray) {
        variableArray.forEach((x) => {
            variableHelper(element, true, x)
        })
    } else {
        variableHelper(element, true, element.attr('element/variableName'))
    }
    return window[`${language}Declaration`](variableHelper(element, true))
}

function functionCallHelper(element) {
    let name = element.attr('element/functionName')
    let returnVar = element.attr('element/functionVariable')
    return {
        name,
        params: element.attr('element/functionParams'),
        returnVar,
        returnType: contexts[name].returnType.split(' ')[0],
        isArray: isArray(contexts[name].returnType),
        variable: varArray[returnVar],
    }
}

function getLanguageExtension() {
    let ext = {
        cpp: 'cpp',
        python: 'py',
    }
    return ext[language]
}

function getCode() {
    return { code, language }
}

function expressionHelper(element) {
    let expr = element.attr('element/expression')
    if (varArray[expr]) return varArray[expr]
    else return { name: element.attr('element/expression') }
}

function assignmentHelper(element) {
    let name = element.attr('element/variableName')
    let obj = {
        name,
        value: element.attr('element/variableValue'),
    }
    if (isArrayNotation(name)) {
        let arrayNotation = name.split('[')
        if (varArray[arrayNotation[0]]) {
            obj = {
                ...varArray[arrayNotation[0]],
                ...obj,
                arrayNotation,
            }
        }
    } else if (varArray[name]) {
        obj = { ...obj, ...varArray[name] }
    }
    return obj
}

// Handles both if and else blocks
function booleanExpressionHelper(element) {
    let originalIndent = indent
    let expr = window[`${language}IfBlock`](expressionHelper(element))
    if (expr !== '') {
        code += indent + expr.statement
        let trueLink = findModel(element.attr('outgoing_link/trueLink')),
            trueBlock = findModel(trueLink.attr('element/target')),
            nextLink = findModel(element.attr('outgoing_link/next')),
            nextElement = findModel(nextLink.attr('element/target')),
            falseLink = findModel(element.attr('outgoing_link/falseLink')),
            falseBlock = findModel(falseLink.attr('element/target'))
        indent += expr.indent
        if (nextElement !== trueBlock) convertLoop(trueBlock, nextElement)
        if (nextElement !== falseBlock) {
            code += originalIndent + window[`${language}BlockClose`]()
            code += originalIndent + window[`${language}ElseBlock`]()
            convertLoop(falseBlock, nextElement)
        }
        indent = originalIndent
        code += indent + window[`${language}BlockClose`]()
    }
}

// Handles loop body by repeatedly calling convertLoop
// till the statement out of loop is reached
function LoopHelper(element) {
    let loopLink = findModel(element.attr('outgoing_link/loopLink')),
        loopBlock = findModel(loopLink.attr('element/target'))
    if (element !== loopBlock) convertLoop(loopBlock, element)
}

function whileLoopHelper(element) {
    let originalIndent = indent
    let expr = window[`${language}WhileLoop`](expressionHelper(element))
    if (expr !== '') {
        code += indent + expr.statement
        indent += expr.indent
        LoopHelper(element)
        indent = originalIndent
        code += indent + window[`${language}BlockClose`]()
    }
}

function forLoopHelper(element) {
    let originalIndent = indent
    let forObj = element.attr('element/forLoop')
    forObj = { ...forObj, expr: expressionHelper(element) }
    code += indent + window[`${language}ForLoop`](forObj).statement
    indent += window[`${language}ForLoop`](forObj).indent
    LoopHelper(element)
    indent = originalIndent
    code += indent + window[`${language}BlockClose`]()
}

//Handling do part of do-while Loop
function doWhileLoopStartHelper(element) {
    originalIndent = indent
    code += indent + window[`${language}DoWhileLoopStart`]().statement
    indent += window[`${language}DoWhileLoopStart`]().indent
}

function checkIfEmpty(element) {
    let op = element.attr('element/type')
    switch (op) {
        case 'input':
        case 'declare':
        case 'assignment':
            if (!element.attr('element/variableName'))
                throw new Error("Variable name can't be empty")
            break
        case 'output':
        case 'while':
        case 'doWhileExpr':
        case 'if':
            if (!element.attr('element/expression'))
                throw new Error("Expression can't be empty")
            break
    }
}

function convertLoop(currentElement, end = null) {
    error = false
    while (true) {
        try {
            checkIfEmpty(currentElement)
            switch (currentElement.attr('element/type')) {
                case 'input':
                    code +=
                        indent +
                        window[`${language}Input`](
                            variableHelper(currentElement),
                            indent
                        )
                    break
                case 'output':
                    code +=
                        indent +
                        window[`${language}Output`](
                            expressionHelper(currentElement),
                            indent
                        )
                    break
                case 'declare':
                    code += indent + declarationHelper(currentElement)
                    break
                case 'assignment':
                    code +=
                        indent +
                        window[`${language}Assignment`](
                            assignmentHelper(currentElement),
                            indent
                        )
                    break
                case 'if':
                    booleanExpressionHelper(currentElement)
                    break
                case 'while':
                    switch (currentElement.attr('element/loopType')) {
                        case 'while':
                            whileLoopHelper(currentElement)
                            break
                        case 'for':
                            forLoopHelper(currentElement)
                            break
                    }
                    break
                case 'circle':
                    if (currentElement.attr('element/circleType') === 'doWhile')
                        doWhileLoopStartHelper(currentElement)
                    break
                case 'doWhileExpr':
                    //Handling while condition in do-while Loop
                    indent = originalIndent
                    code +=
                        indent +
                        window[`${language}DoWhileLoopClose`](
                            expressionHelper(currentElement)
                        )
                    break
                case 'function':
                    code +=
                        indent +
                        window[`${language}FunctionCall`](
                            functionCallHelper(currentElement),
                            indent
                        )
                    break
            }

            if (currentElement.attr('outgoing_link')) {
                let currentLink
                currentLink = findModel(
                    currentElement.attr('outgoing_link/next')
                )
                currentElement = findModel(currentLink.attr('element/target'))
                if (currentElement === end) break
            } else {
                break
            }
        } catch (err) {
            error = true
            swal(err.message || err.toString())
            break
        }
    }
}

function functionDefinitions(lang) {
    language = lang
    let functions = Object.keys(contexts).filter((x) => x !== 'main')
    functions.forEach(async (x) => {
        let params = contexts[x].parameters.slice()
        params.forEach((x, i) => {
            params[i] = {
                ...x,
                isArray: isArray(x.variableType),
                variableType: x.variableType.split(' ')[0],
            }
        })

        let fn = {
            name: x,
            params,
            type:
                contexts[x].returnVariable === ''
                    ? 'void'
                    : contexts[x].returnType.split(' ')[0],
            isArray: isArray(contexts[x].returnType),
        }
        code += window[`${language}FunctionDefinition`](fn)
        $('#currentContext').val(x)
        switchContext()
        let start = findModel(contexts[x].start.id)
        convertLoop(start)
        code += window[`${language}FunctionClose`](contexts[x].returnVariable)
    })
    $('#currentContext').val('main')
    switchContext()
}

function convert(language) {
    code = window[`${language}Headers`]()
    functionDefinitions(language)
    code += window[`${language}FunctionDefinition`]({
        name: 'main',
        type: 'int',
        params: [],
    })
    indent = ''
    if (currentContextName !== 'main') {
        $('#currentContext').val('main')
        switchContext()
    }
    start = findModel(contexts[currentContextName].start.id)
    convertLoop(start, language)
    code += window[`${language}FunctionClose`](0)
    if (!error) {
        openNewTab('/code.html', 'CodeConverter')
        hideLoader()
    }
}
