function updateVariablesInWatchWindow() {
    $('#variable-watch-body tr').remove()
    $('#variable-watch-body').append(getHTMLForVariableWatchWindow())
}

function getHTMLForVariableWatchWindow() {
    let htmlOutput = ''
    Object.keys(variables).forEach((variableName) => {
        let variableValue = variables[variableName].value
        const variableType = variables[variableName].type
        if (variables[variableName].is2DArray) {
            variableValue = twoDArrayToString(variableValue)
        }
        if (variableValue !== 0) variableValue = variableValue || 'N/A'
        htmlOutput += `<tr class="${getTableRowClassForVariableType(
            variableType
        )}"><td>${variableName}</td><td>${variableValue}</td></tr>`
    })
    return htmlOutput
}

function getTableRowClassForVariableType(type) {
    switch (type.split('(')[0]) {
        case 'int':
            return 'table-primary'
        case 'float':
            return 'table-danger'
        case 'char':
            return 'table-warning'
    }
}
