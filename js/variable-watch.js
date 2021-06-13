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
