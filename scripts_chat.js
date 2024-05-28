// Object to store chat history for each friend
var chat_history = {};

document.addEventListener('DOMContentLoaded', () => {
    const friendListItems = document.querySelectorAll('.friend-list li');

    friendListItems.forEach(item => {
        item.addEventListener('click', () => {
            friendListItems.forEach(li => li.classList.remove('active')); // Remove the 'active' class from all friends
            item.classList.add('active'); // Add the 'active' class to the clicked friend
        });
    });
});

// Function to select a friend and display chat history
function select_friend(selected_friend) {
    var friend_name = selected_friend.textContent; // Get the selected friend's name
    var chat_header = document.getElementById('chat-header'); // Update chat header with the selected friend's name
    chat_header.textContent = friend_name;
    display_chat_history(friend_name); // Display chat history for the selected friend
}

// Function to display chat history for a friend
function display_chat_history(friend_name) {
    var chat_messages = document.querySelector('.chat-messages'); // Clear previous messages
    chat_messages.innerHTML = '';

    var messages = chat_history[friend_name] || []; // Get chat history for the selected friend

    messages.forEach(function(message_text) {
        var message = document.createElement('div');
        message.textContent = message_text;
        message.classList.add('message', 'sent');
        chat_messages.appendChild(message); // Add each message to the chat messages
    });

    chat_messages.scrollTop = chat_messages.scrollHeight; // Scroll to the bottom of the chat messages
}

// Function to send a message
function send_message() {
    var message_input = document.querySelector('.chat-input input'); // Get the message input value
    var message_text = message_input.value.trim();

    if (message_text !== '') {
        var friend_name = document.getElementById('chat-header').textContent.trim(); // Get the selected friend's name

        var message = document.createElement('div');
        message.textContent = message_text;
        message.classList.add('message', 'sent');

        var chat_messages = document.querySelector('.chat-messages');
        chat_messages.appendChild(message); // Append the message to the chat messages

        chat_history[friend_name] = chat_history[friend_name] || [];
        chat_history[friend_name].push(message_text); // Add the message to the chat history of the selected friend

        message_input.value = ''; // Clear the message input

        chat_messages.scrollTop = chat_messages.scrollHeight; // Scroll to the bottom of the chat messages
    }
}

// Function to filter friends based on search input
function filter_friends() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("friend-list");
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
        a = li[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = ""; // Show friends that match the filter
        } else {
            li[i].style.display = "none"; // Hide friends that don't match the filter
        }
    }
}

function handle_key_press(event) {
    if (event.key === 'Enter') {
        send_message(); // Send message on Enter key press
    }
}
