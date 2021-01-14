function cppIfBlock(expression) {
    if (expression !== undefined && expression.name !== undefined)
        return { statement: '\tif (' + expression.name + ') {\n', indent: '\t' }
    return ''
}

function cppElseBlock() {
    return '\telse {\n'
}

function cppWhileLoop(expression) {
    if (expression !== undefined && expression.name !== undefined)
        return {
            statement: '\twhile (' + expression.name + ') {\n',
            indent: '\t',
        }
    return ''
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
        if (variable.isArray)
            return (
                '\t' +
                type +
                ' ' +
                variable.name +
                '[' +
                variable.length +
                '];\n'
            )
        else return '\t' + type + ' ' + variable.name + ';\n'
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

function cppAssignment(assignment, indent) {
    if (assignment.value !== undefined) {
        let values = assignment.value.split(',')
        if (assignment.type === 'Char' || assignment.type === undefined) {
            if (values.length === 1) {
                if (
                    values[0].charAt(0) !==
                        values[0].charAt(values[0].length - 1) ||
                    values[0].charAt(0) !== '"'
                )
                    values[0] = '"' + values[0] + '"'

                assignment.value = values[0]
            }
            values.map((x, i) => {
                if (x.charAt(0) !== '"' || x.charAt(0) !== "'")
                    values[i] = "'" + x
                if (
                    x.charAt(x.length - 1) !== '"' ||
                    x.charAt(x.length - 1) !== "'"
                )
                    values[i] += "'"
                if (x.charAt(0) !== x.charAt(x.length - 1))
                    values[i][0] = values[i][x.length - 1] = "'"
            })
        }
        if (assignment.name !== undefined)
            if (
                (assignment.type === 'Char' &&
                    values.length > 1 &&
                    assignment.isArray) ||
                (assignment.type !== 'Char' && assignment.isArray)
            ) {
                let code = ''
                indent += '\t'
                values.map(
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
    fn.params.map((x) => {
        params += cppGetType(x.variableType) + ' ' + x.variableName
        x.isArray ? (params += '[], ') : (params += ', ')
    })
    params = params.slice(0, -2)
    let retVar = fn.type
    fn.isArray ? (retVar += '[] ') : (retVar += ' ')
    retVar += fn.name + '(' + params + ') {\n'
    return retVar
}
