const signingKey = 'Flowgramming | CORE Lab'

function saveFlowChart () {
  const filename = `Untitled.fgmin`
  saveFile(filename, JSON.stringify(JSON.decycle({
    signingKey,
    jointJSGraph: graph.toJSON(),
    flowStart: start.id,
  })))
}

function importFlowGram (file) {
  try {
    const parsedFile = JSON.retrocycle(JSON.parse(file))
    if (parsedFile.signingKey !== signingKey) {
      alert('That\'s an invalid file!')
      return
    }
    const { jointJSGraph, flowStart } = parsedFile
    graph.fromJSON(jointJSGraph)
    paper.fitToContent({
      padding: 20,
      minWidth: $('#paperColumn').width(),
      minHeight: $('#paperColumn').height(),
      gridWidth: 10,
      gridHeight: 10
    })
    start = findModel(flowStart)
  } catch (e) {
    alert('Something went wrong!')
  } finally {
    clearChat()
    renderProgram('Welcome to Flowgramming')
  }
}

function openFromFile (file) {
  clearChat()
  renderProgram('Please wait while your file is getting imported..')
  setTimeout(() => {
    importFlowGram(file)
  }, 10)
}

function saveFile (filename, data) {
  const file = new Blob([data], { type: 'application/json;charset=utf-8' })
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename)
  } else {
    const a = document.createElement('a')
    const url = URL.createObjectURL(file)
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(function () {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }
}