var user = JSON.parse(sessionStorage.getItem("user"));
if (user === "")
    window.location.href = "welcome.html";

function nameUser() {
    document.getElementById('dropbtn').innerHTML = `${user.name}`;
}
document.getElementById('name').value = user.name;
document.getElementById('phone').value = user.contact;

nameUser();

function editUser() {
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    user.name = name;
    user.contact = phone;
    sessionStorage.setItem("user", JSON.stringify(user));
    if (required(name) && required(phone) && allLetter(name) && phonenumber(phone)) {
        var urlencoded = new URLSearchParams();
        urlencoded.append("id", user.id);
        urlencoded.append("name", name);
        urlencoded.append("contact", phone);

        fetch("http://localhost:9000/api/user/edit", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlencoded
            })
            .then((data) => data.json())
            .then((res) => {
                window.location.href = "profile.html";
            });
    } else {
        if (!required(name))
            alertBox("Info", "Enter Your Name", "#ff9800");
        else if (!required(phone))
            alertBox("Info", "Enter Your Mobile No.", "#ff9800");
        else if (!allLetter(name))
            alertBox("Error", "Wrong Name", "#f44336");
        else if (!phonenumber(phone))
            alertBox("Error", "Wrong Contact", "#f44336");
    }
}


function required(input) {
    if (input.length == 0) {
        return false;
    }
    return true;
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

function alertBox(header, msg, color) {
    var alert = document.getElementById('alert');
    var res = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
  <strong>${header}!</strong> ${msg}.`
    alert.innerHTML = res;
    alert.style.backgroundColor = color
    alert.style.display = "block";
}