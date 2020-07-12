var paper = window.paper
var graph = window.graph
var objects = window.objects
var links = window.links

paper.on('element:pointerdblclick', function (elementView) {
  var id = elementView.model.id

  var currentElement = findObject(id)

  if (currentElement.type === 'declare') {
    $('#modal .modal-body').html(`
            <p>Enter Variable Name and Type</p>
             <div class="input-group">
                <input id="variable" type="text" class="form-control" aria-label="Text input with dropdown button" placeholder="Variable Name">
                <p id="datatype" hidden>Default</p>
                <div class="input-group-append">
                    <button id="datatypebtn" class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">DataType
                    </button>
                    <div id="datatypedrop" class="dropdown-menu">
                        <a class="dropdown-item" onclick="toggle('String')">String</a>
                        <a class="dropdown-item" onclick="toggle('Integer')">Integer</a>
                        <a class="dropdown-item" onclick="toggle('Float')">Float</a>
            
                    </div>
                </div>
            </div>
            `)
    $('#modal').modal('show')
    $('#okbtn').one('click', function (event) {
      const variablename = $('#variable').val()
      const datatype = $('#datatype').text().trim()
      if (variablename.length > 0 && datatype !== 'Default') {
        $('#modal').modal('hide')
        currentElement.model.attr('label/text', getWrapText('Declare ' + datatype + ' ' + variablename))
        currentElement.variablename = variablename
        currentElement.variabletype = datatype
      }
    })
  } else if (currentElement.type === 'input') {
    $('#modal .modal-body').html(`
            <p>Enter Variable Name</p>
            <div class="input-group">
                <input id="variable" type="text" class="form-control" aria-label="Text input with dropdown button">
            </div>
            `)
    $('#modal').modal('show')
    $('#okbtn').one('click', function (event) {
      const variablename = $('#variable').val()
      if (variablename.length > 0) {
        $('#modal').modal('hide')
        currentElement.model.attr('label/text', getWrapText('Input ' + variablename))
        currentElement.variablename = variablename
      }
    })
  } else if (currentElement.type === 'output' || currentElement.type === 'if') {
    $('#modal .modal-body').html(`
            <p>Enter the expression</p>
            <div class="input-group">
                <input id="exp" type="text" class="form-control" aria-label="Text input with dropdown button">
            </div>
            `)
    $('#modal').modal('show')
    $('#okbtn').one('click', function (event) {
      const exp = $('#exp').val()
      if (exp.length > 0) {
        $('#modal').modal('hide')
        if (currentElement.type === 'if') { currentElement.model.attr('label/text', getWrapText(exp)) } else { currentElement.model.attr('label/text', getWrapText('Print ' + exp)) }
        currentElement.exp = exp
      }
    })
  }
})

function toggle (dataType) {
  $('#datatype').text(dataType)
  $('#datatypebtn').text(dataType)
}
