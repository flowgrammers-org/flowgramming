/*
 # *************************************************************************************
 # Copyright (C) 2021 Ritwik Murali, Harshit Agarwal, Rajkumar S, Gali Mary Sanjana,
 # Adithi Narayan, Aishwarya B, Adithi Giridharan.
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

function cppIfBlock(expression) {
    return { statement: '\tif (' + expression.name + ') {\n', indent: '\t' }
}

function cppElseBlock() {
    return '\telse {\n'
}

function cppWhileLoop(expression) {
    return {
        statement: '\twhile (' + expression.name + ') {\n',
        indent: '\t',
    }
}

function cppDoWhileLoopStart() {
    return { statement: '\tdo { \n', indent: '\t' }
}

function cppDoWhileLoopClose(expression) {
    expression === undefined || expression.name === undefined
        ? (expression = { name: 'true' })
        : null
    return '\t} while (' + expression.name + ');\n'
}

function cppForLoop(obj) {
    obj.init === undefined ? (obj.init = '') : null
    obj.expr === undefined ? (obj.expr = { name: '' }) : null
    obj.incr === undefined ? (obj.incr = '') : null
    obj.type === undefined ? (obj.type = '') : null
    return {
        statement:
            '\tfor (' +
            obj.type +
            obj.init +
            '; ' +
            obj.expr.name +
            '; ' +
            obj.incr +
            ') {\n',
        indent: '\t',
    }
}

function cppBlockClose() {
    return '\t}\n'
}

function cppLoopClose() {
    return cppBlockClose()
}

function cppIfClose() {
    return cppBlockClose()
}

function cppHandleArray(variable) {
    return cppForLoop({
        init: 'i=0',
        expr: { name: 'i<' + variable.length },
        incr: 'i++',
        type: 'int ',
    }).statement
}

function cppInput(variable, indent) {
    if (variable.name !== undefined)
        if (variable.isArray && variable.type !== 'Char')
            return (
                cppHandleArray(variable) +
                indent +
                '\t\tcin >> ' +
                variable.name +
                '[i];\n' +
                indent +
                cppBlockClose()
            )
        else return '\tcin >> ' + variable.name + ';\n'
    return ''
}

function cppGetType(varType) {
    varType = varType.split(' ')
    let type = {
        Integer: 'int',
        Char: 'char',
        Float: 'float',
        void: 'void',
    }
    return type[varType[0]]
}

function cppDeclaration(variable) {
    let type = cppGetType(variable.type)
    if (type !== '' && variable.name !== undefined)
        if (variable.isArray) {
            let variables = variable.name.split(',')
            let code = '\t' + type + ' '
            variables.forEach((x) => {
                if (variable.is2DArray) {
                    code +=
                        x +
                        '[' +
                        variable.rowLen +
                        ']' +
                        '[' +
                        variable.colLen +
                        '], '
                } else {
                    code += x + '[' + variable.length + '], '
                }
            })

            return code.slice(0, -2) + ';\n'
        } else return '\t' + type + ' ' + variable.name + ';\n'
    return ''
}

function cppOutput(expression, indent) {
    if (expression !== undefined)
        if (expression.isArray && expression.type !== 'Char')
            return (
                cppHandleArray(expression) +
                indent +
                '\t\tcout << ' +
                expression.name +
                '[i];\n' +
                indent +
                cppBlockClose()
            )
        else return '\tcout << ' + expression.name + ';\n'
    return ''
}

function addQuotes(x, quotes = "'") {
    let val = x
    if (x.charAt(0) !== '"' || x.charAt(0) !== "'") val = quotes + x
    if (x.charAt(x.length - 1) !== '"' || x.charAt(x.length - 1) !== "'")
        val += quotes
    if (x.charAt(0) !== x.charAt(x.length - 1))
        val[0] = val[x.length - 1] = quotes
    return val
}

function cppAssignment(assignment, indent) {
    if (assignment.value !== undefined) {
        let values = assignment.value.split(',')
        if (assignment.type === 'Char' || assignment.type === undefined) {
            if (assignment.arrayNotation !== undefined)
                assignment.value = addQuotes(assignment.value)
            else {
                if (values.length === 1)
                    assignment.value = addQuotes(values[0], '"')
                else
                    values.forEach((x, i) => {
                        values[i] = addQuotes(x)
                    })
            }
        }
        if (assignment.name !== undefined)
            if (
                assignment.arrayNotation === undefined &&
                assignment.isArray &&
                ((assignment.type === 'Char' && values.length > 1) ||
                    assignment.type !== 'Char')
            ) {
                let code = ''
                indent += '\t'
                values.forEach(
                    (x, i) =>
                        (code +=
                            indent +
                            assignment.name +
                            '[' +
                            i +
                            '] = ' +
                            x +
                            ';\n')
                )
                return code
            } else
                return '\t' + assignment.name + ' = ' + assignment.value + ';\n'
    }
    return ''
}

function cppFunctionCall(fn, indent) {
    if (fn.returnVar !== '') {
        if (fn.isArray && fn.returnType !== 'char')
            if (fn.variable === undefined || fn.variable.length === undefined)
                return (
                    '\t' +
                    fn.returnType +
                    ' ' +
                    fn.returnVar +
                    '[] = ' +
                    fn.name +
                    ' (' +
                    fn.params +
                    ');\n'
                )
            else
                return (
                    '\t' +
                    fn.returnType +
                    ' temp = ' +
                    fn.name +
                    ' (' +
                    fn.params +
                    ');\n' +
                    indent +
                    cppHandleArray(fn.variable) +
                    indent +
                    '\t\t' +
                    fn.returnVar +
                    '[i] = temp[i];\n' +
                    indent +
                    '\t' +
                    '}' +
                    '\n'
                )
        else
            return (
                '\t' +
                fn.returnVar +
                ' = ' +
                fn.name +
                ' (' +
                fn.params +
                ');\n'
            )
    } else return '\t' + fn.name + ' (' + fn.params + ');\n'
}

function cppHeaders() {
    return (
        '#include <iostream>\n' +
        '#include <string>\n' +
        'using namespace std;\n'
    )
}

function cppFunctionClose(ret) {
    if (ret !== '') return '\treturn ' + ret + '; \n}\n'
    else return '}\n'
}

function cppFunctionDefinition(fn) {
    let params = ''
    fn.params.forEach((x) => {
        params += cppGetType(x.variableType) + ' ' + x.variableName
        x.isArray ? (params += '[], ') : (params += ', ')
    })
    params = params.slice(0, -2)
    let retVar = fn.type
    fn.isArray ? (retVar += '[] ') : (retVar += ' ')
    retVar += fn.name + '(' + params + ') {\n'
    return retVar
}
