function clear_account() {
    document.getElementsByName("account")[0].value = '';
}

function clear_name() {
    document.getElementsByName("name")[0].value = '';
}

function toggle_password_visibility() {
    const password_field = document.getElementsByName('password')[0];
    const password_type = password_field.getAttribute('type') === 'password' ? 'text' : 'password';
    password_field.setAttribute('type', password_type);
}

function toggle_repeatpassword_visibility() {
    const repeat_password_field = document.getElementsByName('repeatpassword')[0];
    const password_type = repeat_password_field.getAttribute('type') === 'password' ? 'text' : 'password';
    repeat_password_field.setAttribute('type', password_type);
}

async function validate_form() {
    const name = document.getElementsByName("name")[0].value;
    const account = document.getElementsByName("account")[0].value;
    const password = document.getElementsByName("password")[0].value;
    const repeat_password = document.getElementsByName("repeatpassword")[0].value;

    if (name.trim() === "" || account.trim() === "" || password.trim() === "" || repeat_password.trim() === "") {
        alert("Vui lòng điền đủ tên, tài khoản, mật khẩu và nhập lại mật khẩu.");
        return false;
    }

    if (password !== repeat_password) {
        alert("Mật khẩu và nhập lại mật khẩu không khớp.");
        return false;
    }

    try {
        const result = await registerUser(name, account, password);
        console.log(result);
        if (result.message == "success register") {
            alert("Đăng ký thành công!");
            window.location.href = "Login.html"; 
        } else {
            alert("Đăng ký thất bại: " + (result.message || "Có lỗi xảy ra"));
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }

    return false; 
}
document.getElementById("register_form").addEventListener("submit",(e) => {
    e.preventDefault(); 
    validate_form();
})



