paper.on('element:pointerdblclick', function (elementView) {
    handleElementDoubleClick(elementView)
})

function handleElementDoubleClick(elementView) {
    const currentElement = findModel(elementView.model.id)
    let handlerFunction, modalBodyHtml

    switch (currentElement.attr('element/type')) {
        case 'declare' : {
            modalBodyHtml = `
                    <p>Enter Variable Name and Type</p>
                     <div class="input-group">
                        <input id="variable" type="text" class="form-control" placeholder="Variable Name">
                        <p id="variableType" hidden>Default</p>
                        <div class="input-group-append">
                            <button id="dataTypeButton" class="btn btn-outline-secondary dropdown-toggle"
                             type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                DataType
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onclick="toggleDataType('Integer')">Integer</a>
                                <a class="dropdown-item" onclick="toggleDataType('Float')">Float</a>
                                <a class="dropdown-item" onclick="toggleDataType('Char')">Character</a>
                                <a class="dropdown-item" onclick="toggleDataType('String')">String</a>
                                <button id="arrayTypeButton" class="btn btn-outline-secondary dropdown-toggle"
                                type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Array
                                </button>
                                   <div class="dropdown-menu">
                                   <a class="dropdown-item" onclick="toggleDataType('Integer array')">Integer</a>
                                   <a class="dropdown-item" onclick="toggleDataType('Float array')">Float</a>
                                   <a class="dropdown-item" onclick="toggleDataType('Char array')">Character</a>
                            </div>
                        </div>
                    </div>
                    </div>
            `
            handlerFunction = function () {
                const variableName = $('#variable').val()
                const variableType = $('#variableType').text().trim()
                $('#modal').modal('hide')
                if (variableName.length <= 0) {
                    alert('Error: Please enter the variable name before declaring the variable')
                } else if (variableType === 'Default') {
                    alert('Error: Please enter the variable type before declaring the variable')
                } else {
                    const regex = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$')
                    const keyWords = ['int', 'float', 'string', 'array', 'char', 'if', 'else', 'while', 'for',
                        'switch', 'case', 'default', 'break', 'continue', 'auto', 'const', 'let', 'var', 'do',
                        'foreach', 'enum', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
                        'struct', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'new', 'throw', 'catch',
                        'printf', 'scanf', 'print', 'cin', 'cout', 'scanner', 'list', 'in', 'true', 'false', 'null', 'None', 'not']
                    if (!regex.test(variableName)) {
                        alert('Follow naming convention while declaring a variable \n \n'
                            + '-> Variable name should start only either with an underscore or an alphabet. It should not start with number or any other special symbols. \n'
                            + '-> Other characters apart from first character can be alphabets, numbers or _ character. \n'
                            + '-> Variable name should not contain space. \n'
                        )
                    } else if (keyWords.includes(variableName)) {
                        alert('Variable name must not be a keyword. \n')
                    } else {
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
                    <input id="variable" type="text" class="form-control">
                </div>
            `
            handlerFunction = function () {
                const variableName = $('#variable').val()
                if (variableName.length > 0) {
                    $('#modal').modal('hide')
                    currentElement.attr({
                        label: {text: getWrapText('Input ' + variableName)},
                        element: {
                            variableName,
                        }
                    })
                }
            }
            break
        }
        case 'output':
        case 'if':
        case 'while': {
            if (currentElement.attr('element/loopType') !== 'for') {
                modalBodyHtml = `
                    <p>Enter the expression</p>
                    <div class="input-group">
                        <input id="exp" type="text" class="form-control">
                    </div>
                `
                handlerFunction = function () {
                    const expression = $('#exp').val()
                    if (expression.length > 0) {
                        $('#modal').modal('hide')
                        currentElement.attr({
                            label: {
                                text: getWrapText(
                                    (currentElement.attr('element/type') === 'output' ? 'Print ' : '') + expression
                                )
                            },
                            element: {
                                expression
                            }
                        })
                    }
                }
            } else {
                modalBodyHtml = `
                      <p>Enter expressions below</p>
                      <hr>
                      <div class="form-group">
                        <label for="initialisation">Initialisation</label>
                        <input type="text" class="form-control" id="initialisation">
                      </div>
                      <div class="form-group">
                        <label for="condition">Condition</label>
                        <input type="text" class="form-control" id="condition">
                      </div>
                      <div class="form-group">
                        <label for="incrementation">Incrementation</label>
                        <input type="text" class="form-control" id="incrementation">
                      </div>
                `
                handlerFunction = function () {
                    const init = $('#initialisation').val()
                    const cond = $('#condition').val()
                    const incr = $('#incrementation').val()
                    $('#modal').modal('hide')
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
            break
        }
        case 'assignment' : {
            modalBodyHtml = `
                <p>Select a variable and enter the value</p>
                <div class="input-group mb-3">
                  <input type="text" id="variableName" class="form-control" placeholder="Variable name">
                  <input type="text" id="variableValue" class="form-control" placeholder="Variable value">
                </div>
            `
            handlerFunction = function () {
                const variableValue = $('#variableValue').val()
                const variableName = $('#variableName').val()
                if (variableValue.length > 0 && variableName.length > 0) {
                    $('#modal').modal('hide')
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

function toggleDataType(dataType) {
    $('#variableType').text(dataType)
    $('#dataTypeButton').text(dataType)
}
