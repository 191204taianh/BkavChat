const apiUrl = 'http://10.2.44.52:8888/api';
// Utility function to handle API requests
async function api_request(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null,
    });

    const result = await response.json();
    // if (!response.ok) {
    //     throw new Error(result.message || 'Network response was not ok');
    // }
    return result;
}

// Register a new user
async function register_user(name, account, password) {
    const endpoint = '/auth/register';
    const body = {
        FullName: name,
        Username: account,
        Password: password,
    };
    // console.log(body);
    return await api_request(endpoint, 'POST', body);
}

// Login user
async function login_user(account, password) {
    const endpoint = '/auth/login';
    const body = {
        Username: account,
        Password: password,
    };
    const result = await api_request(endpoint, 'POST', body);
    console.log(result);

    return result;
}


// Update user information
async function update_user(fullName, avatarFile, token) {
    const endpoint = '/user/update';
    const formData = new FormData();
    formData.append('FullName', fullName);
    if (avatarFile) {
        formData.append('Avatar', avatarFile);
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Network response was not ok');
    }
    return result;
}

// Get user information
async function get_user_info(token) {
    const endpoint = '/user/info';
    return await api_request(endpoint, 'GET', null, token);
}

// Get friends list
async function get_friends_list(token) {
    const endpoint = '/message/list-friend';
    return await api_request(endpoint, 'GET', null, token);
}

// Send a message
async function send_message(friendID, content, files, token) {
    const endpoint = '/message/send-message';
    const formData = new FormData();
    formData.append('FriendID', friendID);
    formData.append('Content', content);
    if (files) {
        files.forEach(file => formData.append('files', file));
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Network response was not ok');
    }
    return result;
}

// Get messages
async function get_messages(friendID, lastTime, token) {
    let endpoint = `/message/get-message?FriendID=${friendID}`;
    if (lastTime) {
        endpoint += `&LastTime=${lastTime}`;
    }
    return await api_request(endpoint, 'GET', null, token);
}

// // Export functions for use in other files
// export {
//     registerUser,
//     loginUser,
//     updateUser,
//     getUserInfo,
//     getFriendsList,
//     sendMessage,
//     getMessages,
// };