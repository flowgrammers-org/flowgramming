paper.on('element:pointerdblclick', function (elementView) {
    handleElementDoubleClick(elementView)
})

/**
 * Returns the current value present at a node depending on the type of the element,
 * so as to populate it by default whenever the node is being edited.
 *
 * @param currentElement - The element model that is being edited
 * @param type - The type of the element being edited
 * @returns {any|string} - An object (or) string with current value if exists, else an empty string
 */
function getCurrentElementValue(currentElement, type) {
    let currentValue = undefined

    switch (type) {
        case 'input' :
            currentValue = currentElement.attr('element/variableName')
            break
        case 'output':
        case 'if':
        case 'doWhileExpr':
        case 'while': {
            if (currentElement.attr('element/loopType') !== 'for') {
                currentValue = currentElement.attr('element/expression')
            } else {
                // In case of an element of 'for' type, it would have 3 different values :
                // "init, condition, increment expression" and hence we are returning the parent element
                // so that while populating we can access the specific property we need.
                const {forLoop, expression} = currentElement.attr('element')
                currentValue = {forLoop, expression}
            }
            break
        }
        case 'declare':
        case 'assignment':
            currentValue = currentElement.attr('element')
            break
    }

    return currentValue || ''
}

/**
 * Utility function to be used for <select> tags, for deciding which data type
 * should be selected in the dropdown
 * @param currentElementValue
 * @param dataType
 * @returns {string}
 */
function shouldSelectDataType(currentElementValue, dataType) {
    // We are handling this case specifically so that 'Default' is marked as selected
    // when the variableType is undefined
    if (dataType === 'Default') {
        return !currentElementValue.variableType || currentElementValue.variableType === 'Default' ? 'selected' : ''
    }

    return currentElementValue.variableType && currentElementValue.variableType.startsWith(dataType) ? 'selected' : ''
}

/**
 * Utility function to be used for <checkbox>,
 * for deciding if the array checkbox should be checked
 * @param currentElementValue
 * @returns {string}
 */
function shouldMarkArrayCheckbox(currentElementValue) {
    return currentElementValue.variableType && currentElementValue.variableType.endsWith("array") ? 'checked' : ''
}

function handleElementDoubleClick(elementView) {
    const currentElement = findModel(elementView.model.id)
    const currentElementType = currentElement.attr('element/type')
    const currentElementValue = getCurrentElementValue(currentElement, currentElementType)

    let handlerFunction, modalBodyHtml

    switch (currentElementType) {
        case 'declare' : {
            modalBodyHtml = `
                    <p>Enter Variable Name and Type</p>
                     <div class="input-group">
                        <input id="variable" type="text" class="form-control" placeholder="Name"
                                value="${currentElementValue.variableName || ''}">
                        <select class="custom-select" id="variableType">
                            <option value="Default" ${shouldSelectDataType(currentElementValue, 'Default')}>
                                Type
                            </option>
                            <option value="Integer" ${shouldSelectDataType(currentElementValue, 'Integer')}>
                                Integer
                            </option>
                            <option value="Float" ${shouldSelectDataType(currentElementValue, 'Float')}>
                                Float
                            </option>
                            <option value="Char" ${shouldSelectDataType(currentElementValue, 'Char')}>
                                Character
                            </option>
                        </select>
                    </div>
                    <hr>
                    <div class="form-check ml-1 mt-1">
                      <input class="form-check-input" type="checkbox" id="isArray" 
                            ${shouldMarkArrayCheckbox(currentElementValue)}>
                      <label class="form-check-label" for="isArray">
                        Is an array
                      </label>
                    </div>
            `
            handlerFunction = function () {
                const variableName = $('#variable').val()
                let variableType = $('#variableType option:selected').val()

                $('#modal').modal('hide')
                if (variableName.length <= 0) {
                    alert('Error: Enter the variable name before declaring it')
                } else if (variableType === 'Default') {
                    alert('Error: Enter the variable type before declaring it')
                } else {
                    // We need to add the array suffix to the data type if the checkbox is checked
                    variableType += $('#isArray').is(':checked') ? ' array' : ''

                    if (handleNamingConvention()) {
                        currentElement.attr({
                            label: {
                                text: getWrapText(variableType + ' ' + variableName)
                            },
                            element: {
                                variableName,
                                variableType
                            }
                        })
                    }
                }
            }
            break
        }
        case 'input' : {
            modalBodyHtml = `
                <p>Enter Variable Name</p>
                <div class="input-group">
                    <input id="variable" type="text" class="form-control"
                            value="${escapeQuotes(currentElementValue)}">
                </div>
            `
            handlerFunction = function () {
                const variableName = $('#variable').val()
                $('#modal').modal('hide')
                if (variableName.length > 0) {
                    currentElement.attr({
                        label: {text: getWrapText('Input ' + variableName)},
                        element: {
                            variableName,
                        }
                    })
                } else {
                    alert('Error: Enter input variable name')
                }
            }
            break
        }
        case 'output':
        case 'if':
        case 'doWhileExpr':
        case 'while': {
            if (currentElement.attr('element/loopType') !== 'for') {
                modalBodyHtml = `
                    <p>Enter the expression</p>
                    <div class="input-group">
                        <input id="exp" type="text" class="form-control"
                                value="${escapeQuotes(currentElementValue)}">
                    </div>
                `
                handlerFunction = function () {
                    const expression = $('#exp').val()
                    $('#modal').modal('hide')
                    if (expression.length > 0) {
                        currentElement.attr({
                            label: {
                                text: getWrapText(
                                    (currentElementType === 'output' ? 'Print ' : '') + expression
                                )
                            },
                            element: {
                                expression
                            }
                        })
                    } else {
                        alert('Error: Enter the expression')
                    }
                }
            } else {
                modalBodyHtml = `
                      <p>Enter expressions below</p>
                      <hr>
                      <div class="form-group">
                        <label for="initialisation">Initialisation</label>
                        <input type="text" class="form-control" id="initialisation"
                            value="${currentElementValue.forLoop ? escapeQuotes(currentElementValue.forLoop.init) || '' : ''}">
                      </div>
                      <div class="form-group">
                        <label for="condition">Condition</label>
                        <input type="text" class="form-control" id="condition"
                            value="${currentElementValue.expression ? escapeQuotes(currentElementValue.expression) : ''}">
                      </div>
                      <div class="form-group">
                        <label for="incrementation">Incrementation</label>
                        <input type="text" class="form-control" id="incrementation"
                            value="${currentElementValue.forLoop ? escapeQuotes(currentElementValue.forLoop.incr) || '' : ''}">
                      </div>
                `
                handlerFunction = function () {
                    const init = $('#initialisation').val()
                    const cond = $('#condition').val()
                    const incr = $('#incrementation').val()
                    $('#modal').modal('hide')
                    if (init.length === 0) {
                        alert('Error: Enter initial value')
                    } else if (cond.length === 0) {
                        alert('Error: Enter the condition')
                    } else if (incr.length === 0) {
                        alert('Error: Increment the variable')
                    } else {
                        currentElement.attr({
                            label: {
                                text: getWrapText(`${init}; ${cond}; ${incr}`)
                            },
                            element: {
                                expression: cond,
                                forLoop: {
                                    init,
                                    incr
                                }
                            }
                        })
                    }
                }
            }
            break
        }
        case 'assignment' : {
            modalBodyHtml = `
                <p>Select a variable and enter the value</p>
                <div class="input-group mb-3">
                  <input type="text" id="variableName" class="form-control" placeholder="Variable name"
                    value="${currentElementValue.variableName ? escapeQuotes(currentElementValue.variableName) : ''}">
                  <input type="text" id="variableValue" class="form-control" placeholder="Variable value"
                    value="${currentElementValue.variableName ? escapeQuotes(currentElementValue.variableValue) : ''}">
                </div>
            `
            handlerFunction = function () {
                const variableValue = $('#variableValue').val()
                const variableName = $('#variableName').val()
                $('#modal').modal('hide')
                if (variableName.length <= 0) {
                    alert('Error: Enter the variable name')
                } else if (variableValue.length <= 0) {
                    alert('Error: Enter variable value')
                } else {
                    currentElement.attr({
                        label: {text: getWrapText(variableName + ' = ' + variableValue)},
                        element: {
                            variableName,
                            variableValue
                        }
                    })
                }
            }
        }
    }
    $('#modal .modal-body').html(modalBodyHtml)
    $('#modal').modal('show')
    $('#okButton').one('click', handlerFunction)
}

function handleNamingConvention(variableName) {
    const regex = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$')
    const keyWords = ['int', 'float', 'string', 'array', 'char', 'if', 'else', 'while', 'for',
        'switch', 'case', 'default', 'break', 'continue', 'auto', 'const', 'let', 'var', 'do',
        'foreach', 'enum', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
        'struct', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'new', 'throw', 'catch',
        'printf', 'scanf', 'print', 'cin', 'cout', 'scanner', 'list', 'in', 'true', 'false', 'null', 'None', 'not']
    if (!regex.test(variableName)) {
        alert('Error: Follow naming convention \n \n'
            + '-> Variable name should start only either with an underscore or an alphabet. It should not start with number or any other special symbols \n'
            + '-> Other characters apart from first character can be alphabets, numbers or _ character \n'
            + '-> Variable name should not contain space \n'
        )
        return false
    } else if (keyWords.includes(variableName)) {
        alert('Error: Variable name must not be a keyword \n')
        return false
    }
    return true
}
