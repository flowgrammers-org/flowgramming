function updateVariablesInWatchWindow() {
    $('#variable-watch-body tr').remove()
    $('#variable-watch-body').append(getHTMLForVariableWatchWindow())
}

function getHTMLForVariableWatchWindow() {
    let htmlOutput = ''
    Object.keys(variables).forEach((variableName) => {
        const variableValue = variables[variableName].value
        const variableType = variables[variableName].type
        htmlOutput += `<tr class="${getTableRowClassForVariableType(
            variableType
        )}"><td>${variableName}</td><td>${variableValue || 'N/A'}</td></tr>`
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
