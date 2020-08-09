var url = window.location.search;
if (url === "")
    window.location.href = "welcome.html";

var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

function register() {
    x.style.left = "-400px";
    y.style.left = "50px";
    z.style.left = "100px";
}

function login() {
    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "0px";
}


function registerUser() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("passwd").value;
    var address = document.getElementById("address").value;
    var contact = document.getElementById("contact").value;


    if (required(name) && required(email) && required(password) && required(address) && required(contact) && allLetter(name) && validateEmail(email) && checkPassword(password) && phonenumber(contact)) {
        var urlencoded = new URLSearchParams();
        urlencoded.append("name", name);
        urlencoded.append("email", email);
        urlencoded.append("password", password);
        urlencoded.append("address", address);
        urlencoded.append("contact", contact);

        fetch("http://localhost:9000/api/user/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlencoded
            })
            .then((data) => data.json())
            .then(res => {
                if (res.result.affectedRows === 0)
                    alertBox("Error", "Email already Exist", "#f44336")
                else {
                    alertBox("Success", "Registered on GoFoody", "#4CAF50")
                    login();
                }
            })
    } else {
        if (!required(name))
            alertBox("Info", "Enter Your Name", "#ff9800");
        else if (!required(email))
            alertBox("Info", "Enter Your Email", "#ff9800");
        else if (!required(password))
            alertBox("Info", "Enter Your Password", "#ff9800");
        else if (!required(address))
            alertBox("Info", "Enter Your Address", "#ff9800");
        else if (!required(contact))
            alertBox("Info", "Enter Your Mobile No.", "#ff9800");
        else if (!allLetter(name))
            alertBox("Error", "Wrong Name", "#f44336");
        else if (!validateEmail(email))
            alertBox("Error", "Wrong Email Address", "#f44336");
        else if (!checkPassword(password))
            alertBox("Error", "Password must be between 6 to 12 characters which contain at least one numeric digit, one uppercase and one lowercase letter ", "#f44336");
        else if (!phonenumber(contact))
            alertBox("Error", "Wrong Contact", "#f44336");
    }
}


function loginUser() {
    var email = document.getElementById("email1").value;
    var password = document.getElementById("passwd1").value;

    if (required(email) && required(password)) {
        var urlencoded = new URLSearchParams();
        urlencoded.append("email", email);
        urlencoded.append("password", password);

        fetch("http://localhost:9000/api/user/authenticate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlencoded
            })
            .then((data) => data.json())
            .then((res) => {
                if (res.status === true) {
                    alert(`${res.message}`);
                    sessionStorage.setItem('user', JSON.stringify(res.data));
                    var url = window.location.search;
                    var dest = url.substring(url.indexOf("="));
                    if (dest === "=home")
                        window.location.href = "welcome.html";
                    else if (dest === "=menu")
                        window.location.href = "menu.html";

                } else {
                    alertBox("Error", res.message, "#f44336");
                }
            })
    } else {
        if (email.length === 0)
            alertBox("Info", "Enter Your Email", "#ff9800");
        else if (password.length === 0)
            alertBox("Info", "Enter Your Password", "#ff9800");
    }
}
// ------------------------------------------------
function required(input) {
    if (input.length == 0) {
        return false;
    }
    return true;
}

function checkPassword(inputtxt) {
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
    if (inputtxt.match(passw)) {
        return true;
    } else {
        return false;
    }
}

function phonenumber(inputtxt) {
    var phoneno = /^\d{10}$/;
    if (inputtxt.match(phoneno)) {
        return true;
    } else {
        return false;
    }
}


function allLetter(input) {
    var letters = /^[A-Za-z]+$/;
    if (input.match(letters)) {
        return true;
    } else {
        return false;
    }
}

function validateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.match(mailformat)) {
        return true;
    } else {
        return false;
    }
}

function alertBox(header, msg, color) {
    var alert = document.getElementById('alert');
    var res = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
    <strong>${header}!</strong> ${msg}.`
    alert.innerHTML = res;
    alert.style.backgroundColor = color
    alert.style.display = "block";
}

// ------------------------------------------------