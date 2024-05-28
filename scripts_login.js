function clear_account() {
    document.getElementsByName("account")[0].value = '';
}

function toggle_password_visibility() {
    var passwordInput = document.getElementsByName("password")[0];
    var toggleImage = document.getElementById("togglePassword");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordInput.style.width = "400px";
        passwordInput.style.height = "60px";
        passwordInput.style.top = "448px";
        passwordInput.style.left = "1321px";
        passwordInput.style.position = "absolute";
        passwordInput.style.borderRadius = "10px";
        passwordInput.style.border = "none";
        passwordInput.style.backgroundColor = "rgba(234, 240, 247, 1)";
        passwordInput.style.boxSizing = "border-box";
        passwordInput.style.fontFamily = "Inter";
        passwordInput.style.fontSize = "26px";
        passwordInput.style.fontWeight = "400";
        passwordInput.style.lineHeight = "24px";
        passwordInput.style.textAlign = "left";
    } else {
        passwordInput.type = "password";
    }
}


async function validate_login() {
    const account = document.getElementsByName("account")[0].value;
    const password = document.getElementsByName("password")[0].value;

    if (account.trim() === "" || password.trim() === "") {
        alert("Vui lòng điền đủ tài khoản và mật khẩu.");
        return false;
    }

    try {
        const result = await loginUser(account, password);
        console.log('Login result:', result); 

        if (result.message == "success register") {    //Analyze the result received from the server
            window.location.href = "Chat.html";
            alert("Đăng nhập thành công: " + result.message);
        } else {
            alert("Đăng nhập thất bại: " + result.message);
        }
    } catch (error) {
        console.error('Error:', error); 
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }

    return false; 
}

document.getElementById("login_form").addEventListener("submit", (a) => {
    a.preventDefault(); 
});




