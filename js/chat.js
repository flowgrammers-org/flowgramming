$chatHistory = $('.chat-history')
$button = $('#chatsend')
$textarea = $('#message-to-send')
$chatHistoryList = this.$chatHistory.find('ul')

function scrollToBottom () {
  $chatHistory.scrollTop($chatHistory[0].scrollHeight)
}

function renderUser () {
  scrollToBottom()
  const messageToSend = $textarea.val().trim()
  if (messageToSend.trim() !== '') {
    const template = Handlebars.compile($('#message-template').html())
    const context = {
      messageOutput: messageToSend
    }
    $chatHistoryList.append(template(context))
    scrollToBottom()
    $textarea.val('')
  }
  return messageToSend
}

function renderProgram (text) {
  const templateResponse = Handlebars.compile($('#message-response-template').html())
  const contextResponse = {
    response: text
  }
  this.$chatHistoryList.append(templateResponse(contextResponse))
  this.scrollToBottom()
}

renderProgram('Welcome to Flow2Code')

async function allowUser () {
  scrollToBottom()
  $('#message-to-send').prop('disabled', false)

  return new Promise(function (resolve, reject) {
    $button.one('click', function (e) {
      resolve(renderUser())
    })
  })
}

function clearChat () {
  $chatHistoryList.html('')
}

function disableUser () {
  $('#message-to-send').prop('disabled', true)
}

disableUser()
