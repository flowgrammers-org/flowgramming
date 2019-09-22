$chatHistory = $('.chat-history');
$button = $('#chatsend');
$textarea = $('#message-to-send');
$chatHistoryList = this.$chatHistory.find('ul');


function scrollToBottom() {
    $chatHistory.scrollTop($chatHistory[0].scrollHeight);
}

(function() {
    $button.on('click', function (e) {
        renderUser();
    });
    $textarea.on('keyup', function (e) {
        if (e.keyCode === 13) {
            renderUser();
        }
    });
})();

function renderUser() {
    scrollToBottom();
    let messageToSend = $textarea.val();
    if (messageToSend.trim() !== '') {
        let template = Handlebars.compile($("#message-template").html());
        let context = {
            messageOutput: messageToSend,
        };
        $chatHistoryList.append(template(context));
        scrollToBottom();
        $textarea.val('');
    }
}

function renderProgram(text) {
    let templateResponse = Handlebars.compile($("#message-response-template").html());
    let contextResponse = {
        response: text,
    };
    this.$chatHistoryList.append(templateResponse(contextResponse));
    this.scrollToBottom();
}

renderProgram("Welcome to Flow2Code");

function allowUser(){
  $('#message-to-send').prop('disabled',false)
}

function disableUser(){
  $('#message-to-send').prop('disabled',true)
}