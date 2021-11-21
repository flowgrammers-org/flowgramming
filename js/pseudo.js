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

function pseudoIfBlock(expression) {
    return { statement: '\tif (' + expression.name + ') \n', indent: '\t' }
}

function pseudoElseBlock() {
    return '\telse \n'
}

function pseudoWhileLoop(expression) {
    return {
        statement: '\twhile (' + expression.name + ')\n',
        indent: '\t',
    }
}

function pseudoDoWhileLoopStart() {
    return { statement: '\tdo\n', indent: '\t' }
}

function pseudoDoWhileLoopClose(expression) {
    expression === undefined || expression.name === undefined
        ? (expression = { name: 'true' })
        : null
    return '\twhile (' + expression.name + ');\n\tendLoop\n'
}

function pseudoForLoop(obj) {
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
            ') \n',
        indent: '\t',
    }
}

function pseudoBlockClose() {
    return '\n'
}

function pseudoLoopClose() {
    return '\tendLoop\n'
}

function pseudoIfClose() {
    return '\tendIf\n'
}

function pseudoInput(variable, indent) {
    if (variable.name !== undefined) return '\tinput (' + variable.name + ')\n'
    return ''
}

function pseudoDeclaration(variable) {
    return cppDeclaration(variable).slice(0, -2) + '\n'
}

function pseudoOutput(expression, indent) {
    if (expression !== undefined) return '\tprint (' + expression.name + ')\n'
    return ''
}

function pseudoAssignment(assignment, indent) {
    if (assignment.value !== undefined) {
        return '\t' + assignment.name + ' = ' + assignment.value + '\n'
    }
    return ''
}

function pseudoFunctionCall(fn, indent) {
    if (fn.returnVar !== '') {
        return (
            '\t' +
            fn.returnVar +
            ' = call ' +
            fn.name +
            ' (' +
            fn.params +
            ')\n'
        )
    } else return '\t call ' + fn.name + ' (' + fn.params + ')\n'
}

function pseudoHeaders() {
    return ''
}

function pseudoFunctionClose(ret) {
    if (ret !== '') return '\treturn ' + ret + ' \nendFn\n'
    else return 'endFn\n'
}

function pseudoFunctionDefinition(fn) {
    return 'startFn\n' + cppFunctionDefinition(fn).slice(0, -2) + '\n'
}
