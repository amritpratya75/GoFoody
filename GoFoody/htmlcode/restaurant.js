function loginRestaurant() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (required(username) && required(password)) {
        var urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);

        fetch("http://localhost:9000/api/rest/auth", {
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
                    sessionStorage.setItem('rest', JSON.stringify(res.data));
                    window.location.href = "rest_dash.html";

                } else {
                    alertBox("Error", res.message, "#f44336");
                }
            })
    } else {
        if (!required(username))
            alertBox("Info", "Enter Your Username", "#ff9800");
        else if (!required(password))
            alertBox("Info", "Enter Your Password", "#ff9800");
    }


}


function reset() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}



function required(input) {
    if (input.length == 0) {
        return false;
    }
    return true;
}



function alertBox(header, msg, color) {
    var alert = document.getElementById('alert');
    var res = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
    <strong>${header}!</strong> ${msg}.`
    alert.innerHTML = res;
    alert.style.backgroundColor = color
    alert.style.display = "block";
}