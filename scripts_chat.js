// scripts_chat.js

async function setDefault(){
    await render_friends_list() ;
}
setDefault();

async function render_friends_list() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found. Redirecting to login.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await get_friends_list(token);
        const friends = response.data;
        // Save friends to local storage
        localStorage.setItem('friends', JSON.stringify(friends));
        render_friends_from_local_storage();
    } catch (error) {
        console.error('Error fetching friends list:', error);
    }
}

function render_friends_from_local_storage() {
    const friends = JSON.parse(localStorage.getItem('friends')) || [];
    const friendListElement = document.getElementById('friend-list');
    friendListElement.innerHTML = '';

    friends.forEach(friend => {
        const li = document.createElement('li');
        li.classList.add('friend-item');

        const img = document.createElement('img');
        img.src = "http://10.2.44.52:8888/api/images" + friend.Avatar; // Assuming 'AvatarUrl' is the key for the avatar image URL in the friend object
        img.alt = `${friend.FullName}'s avatar`;
        img.classList.add('friend-avatar');

        const span = document.createElement('span');
        span.textContent = friend.FullName;
        span.classList.add('friend-name');

        const timestamp = document.createElement('span');
        timestamp.textContent = friend.Timestamp; // Assuming 'Timestamp' is the key for the friend's last activity time
        timestamp.classList.add('friend-timestamp');

        li.appendChild(img);
        li.appendChild(span);
        li.appendChild(timestamp);
        li.onclick = () => select_friend(li);
        friendListElement.appendChild(li);
    });
}



render_friends_from_local_storage()

async function display_user_info() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found in local storage');
        return;
    }

    try {
        const response = await get_user_info(token);
        const userInfo = response.data;
        const fullName = userInfo.FullName;
        const avatarPath = "http://10.2.44.52:8888/api/images" + userInfo.Avatar;

        localStorage.setItem('fullname', fullName);
        localStorage.setItem('avatar', avatarPath);

        if (fullName) {
            document.querySelector('.firstlabel').textContent = fullName;
        }

        if (avatarPath) {
            document.querySelector('.avatar').src = avatarPath;
        }

    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

document.addEventListener('DOMContentLoaded', display_user_info);

// Object to store chat history for each friend
var chatHistory = {};

document.addEventListener('DOMContentLoaded', () => {
    const friendListItems = document.querySelectorAll('.friend-list li');

    friendListItems.forEach(item => {
        item.addEventListener('click', () => {
            friendListItems.forEach(li => li.classList.remove('active')); // Remove the 'active' class from all friends
            item.classList.add('active'); // Add the 'active' class to the clicked friend
        });
    });
});

function select_friend(friend) {
    var friendName = friend.textContent;
    const chatHeader = document.getElementById('chat-header');
    chatHeader.innerHTML = '';

    const img = document.createElement('img');
    img.src = "http://10.2.44.52:8888/api/images" + friend.Avatar; // Assuming 'AvatarUrl' is the key for the avatar image URL in the friend object
    img.alt = `${friend.FullName}'s avatar`;
    img.classList.add('header-avatar');

    const span = document.createElement('span');
    span.textContent = friend.FullName;
    span.classList.add('header-name');

    chatHeader.appendChild(img);
    chatHeader.appendChild(span);
    
    chatHeader.textContent = friendName;
    display_chat_history(friendName);
}

async function fetchMessages(friendId, token) {
    const apiUrl = `http://10.2.44.52:8888/api/message/get-message?FriendID=${friendId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.status === 1) {
        return data.data;
      } else {
        console.error(data.message || "Đã có lỗi xảy ra. Vui lòng thử lại!");
        return [];
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return [];
    }
  }

function display_chat_history(friendName) {
    var chatMessages = document.querySelector('.chat-messages');
    chatMessages.innerHTML = ''; // Clear previous messages

    var messages = chatHistory[friendName] || []; // Get chat history for the selected friend

    messages.forEach(function(messageText) {
        var message = document.createElement('div');
        message.textContent = messageText;
        message.classList.add('message', 'sent');

        // Add right-click context menu
        message.addEventListener('contextmenu', function(event) {
            display_context_menu(event, message);
        });

        chatMessages.appendChild(message); // Add each message to the chat messages
    });

    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom of the chat messages

    // Toggle class based on whether messages are present or not
    if (messages.length > 0) {
        chatMessages.classList.remove('empty');
    } else {
        chatMessages.classList.add('empty');
    }
}

// Function to filter friends based on search input
function filter_friends() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('search_input');
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

async function get_messages() {
    const friendName = localStorage.getItem('selectedFriendName');
    const token = localStorage.getItem('authToken');
    const lastTime = new Date().toISOString(); // For example, use the current time

    if (!friendName || !token) {
        console.error('Friend name or token not found in local storage');
        return;
    }

    const friendID = get_friend_id_by_name(friendName);
    if (!friendID) {
        console.error('Friend ID not found for the given name');
        return;
    }

    try {
        const messages = await fetchMessages(friendID, lastTime, token);
        displayMessages(messages);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
    }
}

// Call loadMessages to fetch and display messages
loadMessages();


document.getElementById('more-info-btn').addEventListener('click', function() {
    var dropdown = document.getElementById('dropdown-menu');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
        setTimeout(function() {
            dropdown.style.opacity = '1';
        }, 10); // Allow some time for the display change before setting opacity
    } else {
        dropdown.style.opacity = '0';
        setTimeout(function() {
            dropdown.style.display = 'none';
        }, 300); // Wait for the opacity transition to finish before hiding
    }
});

document.getElementById('menu-icon').addEventListener('click', function() {
    var menu = document.getElementById('menu');
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
    } else {
        menu.classList.add('open');
    }
});

function get_friend_id_by_name(friendName) {
    const friends = JSON.parse(localStorage.getItem('friends')) || [];
    for (let friend of friends) {
        if (friend.FullName === friendName) {
            return friend.FriendID; 
        }
    }
    return null; // Return null if no friend is found with the given name
}

async function handleSendMessage() {
    const friendName = localStorage.getItem('FullName');
    const token = localStorage.getItem('token');
    const files = getSelectedFiles();

    if (!friendName || !token) {
        console.error('Friend name or token not found in local storage');
        return;
    }

    const friendID = get_friend_id_by_name(friendName);
    if (!friendID) {
        console.error('Friend ID not found for the given name');
        return;
    }

    try {
        const result = await sendMessage(friendID, content, files, token);
        console.log('Message sent successfully:', result);
    } catch (error) {
        console.error('Failed to send message:', error);
    }
}


// Function to send a message
function send_message() {
    var messageInput = document.querySelector('.chat-input input'); // Get the message input value
    var messageText = messageInput.value.trim();

    if (messageText !== '') {
        var friendName = document.getElementById('chat-header').textContent.trim(); // Get the selected friend's name

        var message = document.createElement('div');
        message.textContent = messageText;
        message.classList.add('message', 'sent');

        // Add right-click context menu
        message.addEventListener('contextmenu', function(event) {
            display_context_menu(event, message);
        });

        var chatMessages = document.querySelector('.chat-messages');
        chatMessages.appendChild(message); // Append the message to the chat messages

        chatHistory[friendName] = chatHistory[friendName] || [];
        chatHistory[friendName].push(messageText); // Add the message to the chat history of the selected friend

        // Send message to the server
        // send_message_to_server(friendName, messageText);

        messageInput.value = ''; // Clear the message input

        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom of the chat messages
    }
}


// Example button click handler for sending a message
document.getElementById('send_button').addEventListener('click', handleSendMessage);


// Example action functions
function clear_message(messageElement) {
    messageElement.remove(); // Remove the message element from DOM
}

function edit_message(messageElement) {
    const messageTextElement = messageElement.querySelector('.message-text');
    const newMessageText = prompt('Enter new message:');
    if (newMessageText !== null) {
        messageTextElement.textContent = newMessageText; // Update message text content
    }
}

// Add event listener to handle key press in message input
const messageInput = document.querySelector('.chat-input input');
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        send_message(); // Send message on Enter key press
    }
});

// Add event listener to all existing messages for right-click context menu
const messages = document.querySelectorAll('.message');
messages.forEach(message => {
    message.addEventListener('contextmenu', function(event) {
        display_context_menu(event, message);
    });
});





// Function to display the context menu on right-click
function display_context_menu(event, messageElement) {
    event.preventDefault(); // Prevent default context menu

    // Remove any existing context menus
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    // Create new context menu
    const contextMenu = document.createElement('div');
    contextMenu.classList.add('context-menu');
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;

    const menuOptions = [
        { label: 'clear_message', action: clear_message },
        { label: 'edit_message', action: edit_message }
        // Add more options as needed
    ];

    menuOptions.forEach(option => {
        const menuItem = document.createElement('div');
        menuItem.textContent = option.label.replace('_', ' '); // Replace underscore with space for display
        menuItem.classList.add('context-menu-item');
        menuItem.addEventListener('click', () => {
            option.action(messageElement); // Pass message element or relevant data
            contextMenu.remove(); // Remove menu after action
        });
        contextMenu.appendChild(menuItem);
    });

    document.body.appendChild(contextMenu);

    // Close context menu on outside click
    document.addEventListener('click', close_context_menu);
}

// Function to close context menu
function close_context_menu(event) {
    const contextMenu = document.querySelector('.context-menu');
    if (contextMenu && !contextMenu.contains(event.target)) {
        contextMenu.remove();
    }
}