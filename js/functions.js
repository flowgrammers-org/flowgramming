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

// This is the object that has almost everything from the parent window
let parentWindowContexts = window.opener.getCurrentContexts()

// When the function manager page's DOM is ready,
// let's populate the existing functions into the display table
$(document).ready(function () {
    if (parentWindowContexts) {
        Object.keys(parentWindowContexts).forEach((functionName) => {
            addFunctionToTable(functionName)
        })
    }
})

/**
 * This is called when clicking on the 'Done' button
 * We are updating the contexts object of the parent window,
 * with the locally updated contexts object
 */
function saveFunctions() {
    if (parentWindowContexts)
        window.opener.updateCurrentContexts(parentWindowContexts)
    window.close()
}

function manageFunctionProps(anchorObj, name) {
    const currFunction = parentWindowContexts[name]
    const functionNameObject = $('#functionName')
    functionNameObject.val(name).prop('disabled', true)
    functionNameObject.parent().prev().remove()
    functionNameObject.parent().before(
        `<div class='alert alert-warning' role='alert'>
                Function names are not editable. 
                In case you want to edit, kindly delete and create a new function.
            </div>`
    )
    $('#returnVariable').val(currFunction.returnVariable)
    if (currFunction.returnType) {
        $('#returnType').val(currFunction.returnType)
    }
    $('#parametersTable tr').remove()
    if (currFunction.parameters && currFunction.parameters.length > 0) {
        currFunction.parameters.forEach((item) => {
            addFunctionParamsToTable(item.variableName, item.variableType)
        })
    }
    $('#functionsTable > tr').removeClass('table-info')
    $(anchorObj).parent().parent().addClass('table-info')
}

function getHTMLForFunctionTableRow(functionName) {
    return `<tr>
                <td>${functionName}</td>
                <td>
                    <a class='nav-item d-inline-flex' href='#' role='button' onclick="manageFunctionProps(this, '${functionName}')" title='Edit Function'>
                        <svg class='mx-2 bi bi-list-task my-auto' fill='cornflowerblue' height='1.25em'
                             viewBox='0 0 16 16'
                             width='1.25em'
                             xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                            <path fill-rule='evenodd'
                                  d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z' />
                        </svg>
                    </a>
                    <a class='nav-item d-inline-flex' href='#' role='button' onclick="deleteFunction(this, '${functionName}')" title='Delete Function'>
                        <svg class='mx-2 bi bi-list-task my-auto' fill='maroon' height='1.25em' viewBox='0 0 16 16'
                             width='1.25em'
                             xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                            <path fill-rule='evenodd'
                                  d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z' />
                        </svg>
                    </a>
                    <a class='nav-item d-inline-flex' href='#' role='button' id='save-${functionName}' onclick="downloadFunction('${functionName}')" title='Save Function'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='black' class='bi bi-save' viewBox='0 0 16 16'>
                        <path d='M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z'/>
                        </svg>
                    </a>
                </td>
            </tr>`
}

/**
 * Takes in a functionName and adds to the functions table in DOM
 * This shouldn't be confused with saveFunction()
 * @param functionName
 */
function addFunctionToTable(functionName) {
    const tableBody = $('#functionsTable')
    tableBody.append(getHTMLForFunctionTableRow(functionName))
}

/**
 * The onSubmit listener for the create/edit function form
 * @param form
 * @returns {boolean}
 */
function saveFunction(form) {
    const functionNameObject = $('#functionName')
    const functionName = functionNameObject.val()
    const returnVariable = $('#returnVariable').val()
    const returnType = $('#returnType').val()
    if (!functionName) {
        swal('Function name cannot be empty')
        return false
    }
    if (returnVariable && (!returnType || returnType === 'Default')) {
        swal(
            'Return type of the function need to be selected, when you are returning a variable'
        )
        return false
    }
    if (!handleNamingConvention(functionName, 'Function')) {
        return false
    }
    if (!parentWindowContexts[functionName]) {
        addFunctionToTable(functionName)
    }
    const parameters = []
    $('#parametersTable tr').each(function (i, row) {
        const $row = $(row),
            variableName = $row.find('td:eq(0)').text(),
            variableType = $row.find('td:eq(1)').text()
        parameters.push({
            variableName,
            variableType,
        })
    })
    parentWindowContexts[functionName] = {
        ...(parentWindowContexts[functionName] || {}),
        returnVariable,
        returnType,
        parameters,
    }
    form.reset()
    $('#parametersTable > tr').remove()
    $('#functionsTable > tr').removeClass('table-info')
    functionNameObject.prop('disabled', false)
    functionNameObject.parent().prev().remove()
    toast(`Function '${functionName}' saved`)
    return false
}

/**
 * Deletes a given function from the contexts object as well from the DOM
 * @param functionElement
 * @param functionName
 */
function deleteFunction(functionElement, functionName) {
    delete parentWindowContexts[functionName]

    // The tree is like : '<a> => <td> => <tr>'
    $(functionElement).parent().parent().remove()

    const functionNameObject = $('#functionName')
    $('form').trigger('reset')
    $('#parametersTable > tr').remove()
    $('#functionsTable > tr').removeClass('table-info')
    functionNameObject.prop('disabled', false)
    functionNameObject.parent().prev().remove()
    toast(`Function '${functionName}' deleted successfully`)
}

function deleteParameter(param, name) {
    $(param).parent().parent().remove()
    toast(`Parameter '${name}' deleted successfully`)
}

function getHTMLForParameterRow(paramName, paramType) {
    return `<tr>
                <td>${paramName}</td>
                <td>${paramType}</td>
                <td>
                    <a class='nav-item d-inline-flex' href='#' role='button' onclick="manageFunctionParams(this, '${paramName}','${paramType}')" title='Edit parameter'>
                        <svg class='mx-2 bi bi-list-task my-auto' fill='cornflowerblue' height='1.25em'
                             viewBox='0 0 16 16'
                             width='1.25em'
                             xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                            <path fill-rule='evenodd'
                                  d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z' />
                        </svg>
                    </a>
                    <a class='nav-item d-inline-flex' href='#' role='button' onclick="deleteParameter(this, '${paramName}')" title='Delete parameter'>
                        <svg class='mx-2 bi bi-list-task my-auto' fill='maroon' height='1.25em' viewBox='0 0 16 16'
                             width='1.25em'
                             xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                            <path fill-rule='evenodd'
                                  d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z' />
                        </svg>
                    </a>
                </td>
            </tr>`
}

function addFunctionParamsToTable(paramName, paramType) {
    const tableBody = $('#parametersTable')
    tableBody.append(getHTMLForParameterRow(paramName, paramType))
}

function shouldMarkArray(element) {
    return element && (element.endsWith('[]') || element.endsWith('array'))
        ? 'checked'
        : ''
}

function shouldMark1DArray(element) {
    return (element && !element.endsWith('[]')) || !element ? 'checked' : ''
}

function shouldMark2DArray(element) {
    return element && element.endsWith('[]') ? 'checked' : ''
}

function getModalBodyForManagingParameter(variableName, variableType) {
    return `<p>Enter Variable Name and Type</p>
             <div class='input-group'>
                <input id='variableName' type='text' class='form-control' placeholder='Name'
                        value='${variableName || ''}'>
                <select class='custom-select' id='variableType'>
                    <option value='Default' ${shouldSelectDataType(
                        { variableType },
                        'Default'
                    )} disabled>
                        Type
                    </option>
                    <option value='Integer' ${shouldSelectDataType(
                        { variableType },
                        'Integer'
                    )}>
                        Integer
                    </option>
                    <option value='Float' ${shouldSelectDataType(
                        { variableType },
                        'Float'
                    )}>
                        Float
                    </option>
                    <option value='Char' ${shouldSelectDataType(
                        { variableType },
                        'Char'
                    )}>
                        Character
                    </option>
                </select>
            </div>
            <hr>
            <div class='form-check ml-1 mt-1'>
              <input class='form-check-input' type='checkbox' id='isArray' 
                    ${shouldMarkArray(
                        variableType
                    )} onchange='onArrayCheckboxChanged()' >
              <label class='form-check-label' for='isArray'>
                Is an array
              </label>
            </div>
            <div id='arrayDimension'>
                 <div class='form-check' >
                      <div class='form-check form-check-inline'>
                           <input class='form-check-input' type='radio' id='is1DArray' value='1D' name='dimension' ${shouldMark1DArray(
                               variableType
                           )}>
                           <label class='form-check-label' for='1D'>1D</label>
                      </div>
                      <div class='form-check form-check-inline'>
                           <input class='form-check-input' type='radio' name='dimension' value='2D' id='is2DArray' ${shouldMark2DArray(
                               variableType
                           )}>
                           <label class='form-check-label' for='2D'>2D</label>
                      </div>
                 </div>
            </div> `
}

function manageFunctionParams(currentObject, paramName, paramType) {
    const editMode = currentObject && paramName && paramType
    $('#modal .modal-body').html(
        getModalBodyForManagingParameter(paramName, paramType)
    )
    $('#modal').modal('show')
    $('#isArray').ready(onArrayCheckboxChanged)
    $('#okButton').one('click', () => {
        const variableName = $('#variableName').val()
        let variableType = $('#variableType option:selected').val()

        $('#modal').modal('hide')
        if (variableName.length <= 0) {
            swal('Enter the variable name before declaring it')
        } else if (variableType === 'Default') {
            swal('Enter the variable type before declaring it')
        } else {
            // We need to add the array suffix to the data type if the checkbox is checked
            variableType += $('#isArray').is(':checked') ? ' array' : ''
            variableType += $('#is2DArray').is(':checked') ? ' []' : ''
            if (handleNamingConvention()) {
                if (editMode) {
                    $(currentObject)
                        .parent()
                        .parent()
                        .after(
                            getHTMLForParameterRow(variableName, variableType)
                        )
                    $(currentObject).parent().parent().remove()
                } else {
                    addFunctionParamsToTable(variableName, variableType)
                }
            }
        }
    })
}
