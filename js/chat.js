$chatHistory = $('.chat-history');
$button = $('#chatsend');
$textarea = $('#message-to-send');
$chatHistoryList = this.$chatHistory.find('ul');


function scrollToBottom() {
    $chatHistory.scrollTop($chatHistory[0].scrollHeight);
}

// (function() {
//     $button.on('click', function (e) {
//         renderUser();
//     });
//     $textarea.on('keyup', function (e) {
//         if (e.keyCode === 13) {
//             renderUser();
//         }
//     });
// })();

function renderUser() {
    scrollToBottom();
    let messageToSend = $textarea.val().trim();
    if (messageToSend.trim() !== '') {
        let template = Handlebars.compile($("#message-template").html());
        let context = {
            messageOutput: messageToSend,
        };
        $chatHistoryList.append(template(context));
        scrollToBottom();
        $textarea.val('');
    }
    return messageToSend;
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

async function allowUser() {
    scrollToBottom();
    $('#message-to-send').prop('disabled', false)

    return new Promise(function (resolve, reject) {
        $button.one('click', function (e) {
            resolve(renderUser())
        });
        // $textarea.one('keyup', function (e) {
        //     if (e.keyCode === 13) {
        //         resolve(renderUser());
        //     }
        // });
    });
}

function clearChat() {
    $chatHistoryList.html("");
}

function disableUser() {
    $('#message-to-send').prop('disabled', true)
}

disableUser();