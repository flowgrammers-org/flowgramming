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
        case 'input':
            currentValue = currentElement.attr('element/variableName')
            break
        case 'output':
        case 'comment':
        case 'if':
        case 'doWhileExpr':
        case 'while': {
            if (currentElement.attr('element/loopType') !== 'for') {
                currentValue = currentElement.attr('element/expression')
            } else {
                // In case of an element of 'for' type, it would have 3 different values :
                // "init, condition, increment expression" and hence we are returning the parent element
                // so that while populating we can access the specific property we need.
                const { forLoop, expression } = currentElement.attr('element')
                currentValue = { forLoop, expression }
            }
            break
        }
        case 'declare':
        case 'assignment':
        case 'function':
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
        return !currentElementValue.variableType ||
            currentElementValue.variableType === 'Default'
            ? 'selected'
            : ''
    }

    return currentElementValue.variableType &&
        currentElementValue.variableType.startsWith(dataType)
        ? 'selected'
        : ''
}

/**
 * Utility function to be used for <checkbox>,
 * for deciding if the array checkbox should be checked
 * @param currentElementValue
 * @returns {string}
 */
function shouldMarkArrayCheckbox(currentElementValue) {
    return currentElementValue.variableType &&
        currentElementValue.variableType.endsWith('array')
        ? 'checked'
        : ''
}

function onArrayCheckboxChanged() {
    if ($('#isArray').is(':checked')) {
        $('#arrayDimension').show()
        onArrayDimensionChanged()
    } else $('#arrayDimension').hide()
}

function shouldMarkArray2D(currentElementValue) {
    return currentElementValue.is2DArray ? 'checked' : ''
}

function shouldMarkArray1D(currentElementValue) {
    return !currentElementValue.is2DArray ? 'checked' : ''
}

function onArrayDimensionChanged() {
    let val = $("input[name='dimension']:checked").val()
    if (val === '1D') {
        $('#arrayLength').show()
        $('#array2D').hide()
    } else {
        $('#arrayLength').hide()
        $('#array2D').show()
    }
}

function handleElementDoubleClick(elementView) {
    const currentElement = findModel(elementView.model.id)
    $('#delbtn').text('Delete').attr('onclick', 'handleDelete()')
    $('#modal .modal-content').attr(
        'data-element',
        JSON.stringify(currentElement)
    )
    const currentElementType = currentElement.attr('element/type')
    const currentElementValue = getCurrentElementValue(
        currentElement,
        currentElementType
    )

    let handlerFunction, modalBodyHtml

    switch (currentElementType) {
        case 'declare': {
            modalBodyHtml = `
                    <p>Enter Variable Name and Type</p>
                     <div class="input-group">
                        <input id="variable" type="text" class="form-control" placeholder="Name"
                                value="${
                                    currentElementValue.variableName || ''
                                }">
                        <select class="custom-select" id="variableType">
                            <option value="Default" ${shouldSelectDataType(
                                currentElementValue,
                                'Default'
                            )} disabled>
                                Type
                            </option>
                            <option value="Integer" ${shouldSelectDataType(
                                currentElementValue,
                                'Integer'
                            )}>
                                Integer
                            </option>
                            <option value="Float" ${shouldSelectDataType(
                                currentElementValue,
                                'Float'
                            )}>
                                Float
                            </option>
                            <option value="Char" ${shouldSelectDataType(
                                currentElementValue,
                                'Char'
                            )}>
                                Character
                            </option>
                        </select>
                    </div>
                    <hr>
                    <div class="form-check ml-1 mt-1">
                      <input class="form-check-input" type="checkbox" id="isArray" 
                            ${shouldMarkArrayCheckbox(
                                currentElementValue
                            )} onclick="onArrayCheckboxChanged()">
                      <label class="form-check-label" for="isArray">
                        Is an array
                      </label>
                    </div>
                    <div id='arrayDimension'>
                        <div class="form-check" >
                            <div class="form-check form-check-inline">
                              <input class="form-check-input" type="radio" id="1D" value='1D' name='dimension' ${shouldMarkArray1D(
                                  currentElementValue
                              )} onchange="onArrayDimensionChanged()">
                              <label class="form-check-label" for="1D">1D</label>
                            </div>
                            <div class="form-check form-check-inline">
                              <input class="form-check-input" type="radio" name='dimension' value='2D' id="2D" ${shouldMarkArray2D(
                                  currentElementValue
                              )} onchange='onArrayDimensionChanged()'>
                              <label class="form-check-label" for="2D">2D</label>
                            </div>
                        </div>
                        <div class="input-group mt-2" >
                            <input id="arrayLength" type="number" class="form-control" placeholder="Array length"
                                        value="${
                                            currentElementValue.arrayLength ||
                                            ''
                                        }" min="1">
                        </div>  
                        <div class="input-group mt-2" id='array2D'>
                            <input id="arrayRow" type="number" class="form-control" placeholder="Rows"
                                        value="${
                                            currentElementValue.rowLen || ''
                                        }" min="1">
                            <input id="arrayCol" type="number" class="form-control" placeholder="Columns"
                                        value="${
                                            currentElementValue.colLen || ''
                                        }" min="1">
                        </div>   
                    </div> 
            `

            handlerFunction = function () {
                const variableName = $('#variable').val()
                let variableType = $('#variableType option:selected').val()
                let arrayLength = $('#arrayLength').val()
                let rowLen = $('#arrayRow').val()
                let colLen = $('#arrayCol').val()

                $('#modal').modal('hide')
                if (variableName.length <= 0) {
                    swal('Enter the variable name before declaring it')
                } else if (variableType === 'Default') {
                    swal('Enter the variable type before declaring it')
                } else if (
                    $('#isArray').is(':checked') &&
                    $("input[name='dimension']:checked").val() === '1D' &&
                    (parseInt(arrayLength) === 0 ||
                        isNaN(parseInt(arrayLength)))
                ) {
                    swal('The array length should be declared')
                } else if (
                    $('#isArray').is(':checked') &&
                    $("input[name='dimension']:checked").val() === '2D' &&
                    (parseInt(rowLen) === 0 ||
                        isNaN(parseInt(rowLen)) ||
                        isNaN(parseInt(colLen)) ||
                        parseInt(colLen) === 0)
                ) {
                    swal('The number of rows and columns should be declared')
                } else if (
                    rowLen.includes('.') ||
                    colLen.includes('.') ||
                    arrayLength.includes('.')
                ) {
                    swal('Array sizes must only be natural numbers')
                } else {
                    const isArrayChecked = $('#isArray').is(':checked')
                    const is2DArray =
                        $("input[name='dimension']:checked").val() === '2D'
                    // We need to add the array suffix to the data type if the checkbox is checked
                    variableType += isArrayChecked ? ' array' : ''
                    let variableLabel = `${variableType} `
                    variableArray = variableName.split(',')
                    let namingConventionTest = true
                    for (let i = 0; i < variableArray.length; i++) {
                        namingConventionTest =
                            namingConventionTest &&
                            handleNamingConvention(variableArray[i])
                        if (!namingConventionTest) {
                            break
                        }
                    }
                    if (namingConventionTest) {
                        if (isArrayChecked) {
                            if (is2DArray) {
                                variableArray.forEach((x) => {
                                    variableLabel += `${x}[${rowLen}][${colLen}], `
                                })
                                arrayLength = ''
                            } else {
                                variableArray.forEach((x) => {
                                    variableLabel += `${x}[${arrayLength}], `
                                })
                                rowLen = colLen = ''
                            }
                        } else {
                            variableArray.forEach((x) => {
                                variableLabel += `${x}, `
                            })
                        }

                        currentElement.attr({
                            label: {
                                text: getWrapText(variableLabel.slice(0, -2)),
                            },
                            element: {
                                variableName,
                                variableArray,
                                variableType,
                                is2DArray,
                                rowLen,
                                colLen,
                                arrayLength,
                                isArrayChecked,
                            },
                        })
                    }
                }
            }
            break
        }
        case 'input': {
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
                        label: { text: getWrapText('Input ' + variableName) },
                        element: {
                            variableName,
                        },
                    })
                } else {
                    swal('Enter input variable name')
                }
            }
            break
        }
        case 'comment':
            {
                modalBodyHtml = `
                    <p>Enter the comment</p>
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
                                text: getWrapText(expression),
                            },
                            element: {
                                expression,
                            },
                        })
                    } else {
                        swal('Enter the comment')
                    }
                }
            }
            break
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
                                    (currentElementType === 'output'
                                        ? 'Print '
                                        : '') + expression
                                ),
                            },
                            element: {
                                expression,
                            },
                        })
                    } else {
                        swal('Enter the expression')
                    }
                }
            } else {
                modalBodyHtml = `
                      <p>Enter expressions below</p>
                      <hr>
                      <div class="form-group">
                        <label for="initialisation">Initialisation</label>
                        <input type="text" class="form-control" id="initialisation"
                            value="${
                                currentElementValue.forLoop
                                    ? escapeQuotes(
                                          currentElementValue.forLoop.init
                                      ) || ''
                                    : ''
                            }">
                      </div>
                      <div class="form-group">
                        <label for="condition">Condition</label>
                        <input type="text" class="form-control" id="condition"
                            value="${
                                currentElementValue.expression
                                    ? escapeQuotes(
                                          currentElementValue.expression
                                      )
                                    : ''
                            }">
                      </div>
                      <div class="form-group">
                        <label for="incrementation">Incrementation</label>
                        <input type="text" class="form-control" id="incrementation"
                            value="${
                                currentElementValue.forLoop
                                    ? escapeQuotes(
                                          currentElementValue.forLoop.incr
                                      ) || ''
                                    : ''
                            }">
                      </div>
                `
                handlerFunction = function () {
                    const init = $('#initialisation').val()
                    const cond = $('#condition').val()
                    const incr = $('#incrementation').val()
                    $('#modal').modal('hide')
                    if (init.length === 0) {
                        swal('Enter initial value')
                    } else if (cond.length === 0) {
                        swal('Enter the condition')
                    } else if (incr.length === 0) {
                        swal('Increment the variable')
                    } else {
                        currentElement.attr({
                            label: {
                                text: getWrapText(`${init}; ${cond}; ${incr}`),
                            },
                            element: {
                                expression: cond,
                                forLoop: {
                                    init,
                                    incr,
                                },
                            },
                        })
                    }
                }
            }
            break
        }
        case 'assignment': {
            modalBodyHtml = `
                <p>Select a variable and enter the value</p>
                <div class="input-group mb-3">
                  <input type="text" id="variableName" class="form-control" placeholder="Variable name"
                    value="${
                        currentElementValue.variableName
                            ? escapeQuotes(currentElementValue.variableName)
                            : ''
                    }">
                  <input type="text" id="variableValue" class="form-control" placeholder="Variable value"
                    value="${
                        currentElementValue.variableName
                            ? escapeQuotes(currentElementValue.variableValue)
                            : ''
                    }">
                </div>
            `
            handlerFunction = function () {
                const variableValue = $('#variableValue').val()
                const variableName = $('#variableName').val()
                $('#modal').modal('hide')
                if (variableName.length <= 0) {
                    swal('Enter the variable name')
                } else if (variableValue.length <= 0) {
                    swal('Enter variable value')
                } else {
                    currentElement.attr({
                        label: {
                            text: getWrapText(
                                variableName + ' = ' + variableValue
                            ),
                        },
                        element: {
                            variableName,
                            variableValue,
                        },
                    })
                }
            }
            break
        }
        case 'function': {
            modalBodyHtml = `
                <p>Function call</p>
                <div class="input-group mb-3">
                  <input type="text" id="functionName" class="form-control" placeholder="Function name"
                    value="${
                        currentElementValue.functionName
                            ? escapeQuotes(currentElementValue.functionName)
                            : ''
                    }">
                </div>
                <div class="input-group mb-3">
                  <input type="text" id="functionParams" class="form-control" placeholder="Comma separated parameters"
                    value="${
                        currentElementValue.functionParams
                            ? escapeQuotes(currentElementValue.functionParams)
                            : ''
                    }">
                </div>
                <div class="input-group">
                  <input type="text" id="functionVariable" class="form-control" placeholder="Variable for return value"
                    value="${
                        currentElementValue.functionVariable
                            ? escapeQuotes(currentElementValue.functionVariable)
                            : ''
                    }">
                </div>
            `
            handlerFunction = function () {
                const functionParams = $('#functionParams').val()
                const functionName = $('#functionName').val()
                const functionVariable = $('#functionVariable').val()
                $('#modal').modal('hide')
                if (functionName.length <= 0) {
                    swal('Enter the function name')
                } else {
                    currentElement.attr({
                        label: {
                            text: getWrapText(
                                (functionVariable
                                    ? `${functionVariable} = `
                                    : '') + `${functionName}(${functionParams})`
                            ),
                        },
                        element: {
                            functionName,
                            functionParams,
                            functionVariable,
                        },
                    })
                }
            }
        }
    }
    $('#modal .modal-body').html(modalBodyHtml)
    $('#modal').modal('show')
    $('#okButton').one('click', handlerFunction)
    $('#xbtn').on('click', function () {
        $('#okButton').off('click')
    })
    $('#isArray').ready(onArrayCheckboxChanged)
}

function handleNamingConvention(variableName, type = 'Variable') {
    const regex = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$')
    const keyWords = [
        'int',
        'float',
        'string',
        'array',
        'char',
        'if',
        'else',
        'while',
        'for',
        'switch',
        'case',
        'default',
        'break',
        'continue',
        'auto',
        'const',
        'let',
        'var',
        'do',
        'foreach',
        'enum',
        'long',
        'register',
        'return',
        'short',
        'signed',
        'sizeof',
        'static',
        'struct',
        'typedef',
        'union',
        'unsigned',
        'void',
        'volatile',
        'new',
        'throw',
        'catch',
        'printf',
        'scanf',
        'print',
        'cin',
        'cout',
        'scanner',
        'list',
        'in',
        'true',
        'false',
        'null',
        'None',
        'not',
    ]
    if (!regex.test(variableName)) {
        swal(
            'Follow naming convention <br> <hr>' +
                `${type} name should start only either with an underscore or an alphabet. It should not start with number or any other special symbols <hr>` +
                `Other characters apart from first character can be alphabets, numbers or _ character <hr>` +
                `${type} name should not contain space <br>`
        )
        return false
    } else if (keyWords.includes(variableName)) {
        swal(`${type} name must not be a keyword`)
        return false
    }
    return true
}

function handleDelete() {
    try {
        let currentElement = $('#modal .modal-content').attr('data-element')
        if (currentElement)
            currentElement = findModel(JSON.parse(currentElement).id)
        if (currentElement.attr('element/type') === 'if') {
            deleteIF(currentElement)
        } else if (currentElement.attr('element/type') === 'while') {
            deleteWhile(currentElement)
        } else if (currentElement.attr('element/type') === 'doWhileExpr') {
            throw new Error("DoWhile Block can't be deleted")
        } else {
            deleteBlock(currentElement)
        }
    } catch (e) {
        swal(e.toString())
    }
}
