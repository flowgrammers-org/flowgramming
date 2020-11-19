const signingKey = 'Flowgramming | CORE Lab | v2'

function saveFlowChart() {
    // Usually, the contexts object will not have the latest graph of the current context.
    // It is updated only when the context is switched. However, when we are saving the flowgram also,
    // we want to be sure that the graph of current context is the latest.
    // Hence, this is a nice little hack to achieve the same.
    switchContext()

    const filename = `Untitled.fgmin`
    saveFile(
        filename,
        JSON.stringify(
            JSON.decycle({
                signingKey,
                contexts,
            })
        )
    )
}

function importFlowGram(file) {
    try {
        const parsedFile = JSON.retrocycle(JSON.parse(file))
        if (parsedFile.signingKey !== signingKey) {
            swal("Flowgramming doesn't support that file!")
            return
        }
        contexts = parsedFile.contexts
        currentContextName = 'main'
        graph.fromJSON(contexts[currentContextName].graph)
        paper.fitToContent({
            padding: 20,
            minWidth: paperColumn.width(),
            minHeight: paperColumn.height(),
            gridWidth: 10,
            gridHeight: 10,
        })
        start = findModel(contexts[currentContextName].start.id)
        updateContextsDropdown()
    } catch (e) {
        swal('Something went wrong!')
    } finally {
        clearChat()
        renderProgram('Start Flowgramming!')
    }
}

function openFromFile(file) {
    clearChat()
    renderProgram('Please wait while your file is getting imported..')
    setTimeout(() => {
        importFlowGram(file)
    }, 1000)
}

function saveFile(filename, data) {
    const file = new Blob([data], { type: 'application/json;charset=utf-8' })
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename)
    } else {
        const saveButton = document.getElementById('save-btn')
        saveButton.href = URL.createObjectURL(file)
        saveButton.download = filename
    }
}
