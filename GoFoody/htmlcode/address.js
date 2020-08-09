var admin = JSON.parse(sessionStorage.getItem('admin'));
if (admin == null)
    window.location.href = "admin.html";

function logout() {
    sessionStorage.removeItem('admin');
    window.location.href = "admin.html";

}


function showAddress() {
    fetch(`http://localhost:9000/api/rest/showrest`)
        .then((data) => data.json())
        .then((res) => {
            var output = ` <table>
                <tr>
                <th>Owner</th>
                <th>Username</th>
                <th>Address</th>
                <th>State</th>
                <th>City</th>
                <th>Pincode</th>
                <th>Contact</th>
                <th>Remove</th>
                </tr>`;
            res.forEach((i) => {
                output += `
              <tr>
              <td>${i.owner}</td>
                <td>${i.username}</td>
                <td>${i.address}</td>
                <td>${i.state}</td>
                <td>${i.city}</td>
                <td>${i.pincode}</td>
                <td>${i.contact}</td>
                <td><button onclick= "remove(${i.rest_id})">X</button></td>
              </tr>
    `
            });
            output += `</table>`
            document.getElementById('showaddress').innerHTML = output;
        });
}

function remove(id) {
    fetch(`http://localhost:9000/api/rest/deleterest/${id}`, {
            method: 'DELETE',
        })
        .then(showAddress())
}

function add() {
    var owner = document.getElementById('owner').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var address = document.getElementById('address').value;
    var state = document.getElementById('state').value;
    var city = document.getElementById('city').value;
    var pincode = document.getElementById('pincode').value;
    var contact = document.getElementById('contact').value;
    if (required(address) && required(city) && required(state) && required(pincode) && required(contact) && phonenumber(contact)) {
        var urlencoded = new URLSearchParams();
        urlencoded.append("owner", owner);
        urlencoded.append("username", username);
        urlencoded.append("password", password);
        urlencoded.append("address", address);
        urlencoded.append("city", city);
        urlencoded.append("state", state);
        urlencoded.append("pincode", pincode);
        urlencoded.append("contact", contact);

        fetch("http://localhost:9000/api/rest/addrest", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlencoded
            })
            .then(response => {
                var status = response.status;
                if (status === 200) {
                    showAddress();
                    reset();
                }
            })
    } else {
        if (!required(address))
            alertBox("Info", "Enter Your Address", "#ff9800");
        else if (!required(state))
            alertBox("Info", "Enter Your State", "#ff9800");
        else if (!required(city))
            alertBox("Info", "Enter Your City", "#ff9800");
        else if (!required(pincode))
            alertBox("Info", "Enter Your Pincode", "#ff9800");
        else if (!required(contact))
            alertBox("Info", "Enter Your Contact", "#ff9800");
        else if (!phonenumber(contact))
            alertBox("Error", "Wrong Contact", "#f44336");
    }
}

function reset() {
    document.getElementById('address').value = "";
    document.getElementById('state').value = "";
    document.getElementById('city').value = "";
    document.getElementById('pincode').value = "";
    document.getElementById('contact').value = "";
}
showAddress();

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


function alertBox(header, msg, color) {
    var alert = document.getElementById('alert');
    var res = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
  <strong>${header}!</strong> ${msg}.`
    alert.innerHTML = res;
    alert.style.backgroundColor = color
    alert.style.display = "block";
}