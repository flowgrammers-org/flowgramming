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

const signingKey = 'Flowgramming'

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
        hideLoader()
    }
}

function openFromFile(file) {
    showLoader('Importing', 'Please wait while your flowgram is imported')
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