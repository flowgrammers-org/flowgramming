/*
 # *************************************************************************************
 # Copyright (C) 2021 Ritwik Murali, Harshit Agarwal, Rajkumar S, Gali Mary Sanjana,
 # Adithi Narayan, Aishwarya B, Adithi Giridharan.
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

$chatHistory = $('.chat-history')
$button = $('#chatsend')
$textarea = $('#message-to-send')
$chatHistoryList = $chatHistory.find('ul')

function scrollToBottom() {
    document
        .querySelector('.chat-history')
        .scrollIntoView({ behavior: 'smooth', block: 'end' })
}

function renderUser() {
    scrollToBottom()
    const messageToSend = $textarea.val().trim()
    if (messageToSend.trim() !== '') {
        const template = Handlebars.compile($('#message-template').html())
        const context = {
            messageOutput: messageToSend,
        }
        $chatHistoryList.append(template(context))
        scrollToBottom()
        $textarea.val('')
    }
    return messageToSend
}

function renderProgram(text) {
    const templateResponse = Handlebars.compile(
        $('#message-response-template').html()
    )
    const contextResponse = {
        response: text,
    }
    this.$chatHistoryList.append(templateResponse(contextResponse))
    this.scrollToBottom()
}

renderProgram('Start Flowgramming!')

async function allowUser() {
    scrollToBottom()
    $textarea.prop('disabled', false)
    return new Promise(function (resolve, reject) {
        $button.one('click', function (e) {
            clearInterval(timer)
            resolve(renderUser())
        })
        let timer = setInterval(() => {
            if (stopped) {
                resolve('Stopped')
                $button.click()
                clearInterval(timer)
            }
        }, 2000)
    })
}

function clearChat() {
    $chatHistoryList.html('')
}

function disableUser() {
    $textarea.prop('disabled', true)
}

disableUser()
