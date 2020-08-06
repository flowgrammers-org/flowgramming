paper.on('element:pointerdblclick', function (elementView) {
  handleElementDoubleClick(elementView)
})

function handleElementDoubleClick (elementView) {
  const id = elementView.model.id
  const currentElement = findModel(id)

  if (currentElement.attr('element/type') === 'declare') {
    $('#modal .modal-body').html(`
            <p>Enter Variable Name and Type</p>
             <div class="input-group">
                <input id="variable" type="text" class="form-control" aria-label="Text input with dropdown button" placeholder="Variable Name">
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
                    </div>
                </div>
            </div>
    `)
    $('#modal').modal('show')
    $('#okButton').one('click', function () {
      const variableName = $('#variable').val()
      const variableType = $('#variableType').text().trim()
      if (variableName.length > 0 && variableType !== 'Default') {
        $('#modal').modal('hide')
        currentElement.attr({
          label: {
            text: getWrapText('Declare ' + variableType + ' ' + variableName)
          },
          element: {
            variableName,
            variableType
          }
        })
      }
    })
  } else if (currentElement.attr('element/type') === 'input') {
    $('#modal .modal-body').html(`
            <p>Enter Variable Name</p>
            <div class="input-group">
                <input id="variable" type="text" class="form-control" aria-label="Text input with dropdown button">
            </div>
    `)
    $('#modal').modal('show')
    $('#okButton').one('click', function () {
      const variableName = $('#variable').val()
      if (variableName.length > 0) {
        $('#modal').modal('hide')
        currentElement.attr({
          label: { text: getWrapText('Input ' + variableName) },
          element: {
            variableName,
          }
        })
      }
    })
  } else if (currentElement.attr('element/type') === 'output' || currentElement.attr('element/type') === 'if') {
    $('#modal .modal-body').html(`
            <p>Enter the expression</p>
            <div class="input-group">
                <input id="exp" type="text" class="form-control" aria-label="Text input with dropdown button">
            </div>
    `)
    $('#modal').modal('show')
    $('#okButton').one('click', function () {
      const expression = $('#exp').val()
      if (expression.length > 0) {
        $('#modal').modal('hide')
        currentElement.attr({
          label: {
            text: getWrapText(
              (currentElement.attr('element/type') !== 'if' ? 'Print ' : '') + expression
            )
          },
          element: {
            expression
          }
        })
      }
    })
  }
}

function toggleDataType (dataType) {
  $('#variableType').text(dataType)
  $('#dataTypeButton').text(dataType)
}
