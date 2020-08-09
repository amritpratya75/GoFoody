const search = document.querySelector(".search");
const matchlist = document.getElementById("matchlist");
const searchRest = async searchText => {
    const res = await fetch('http://localhost:9000/api/rest/showrest');
    const rests = await res.json();


    let matches = rests.filter(rest => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return rest.city.match(regex);

    });
    if (searchText.length === 0) {
        matches = [];
        matchlist.innerHTML = '';
    }
    outputHtml(matches);
};
const outputHtml = matches => {
    if (matches.length > 0) {
        const html = matches.map(match => `
    <li>${match.address},${match.city},${match.state},Pincode:-${match.pincode}</li>
	`).join("");
        matchlist.innerHTML = html;
    }
}

function fetchData(event) {
    search.value = event.target.textContent;
    matchlist.innerHTML = '';
}
search.addEventListener('input', () => searchRest(search.value));

function storeAdd() {
    var addres = search.value;
    // window.localStorage.setItem("address",address);
    // if(address !== null){
    // window.location.href="menu.html";
    // }
    if (addres !== "") {
        fetch('http://localhost:9000/api/rest/showrest')
            .then((data) => data.json())
            .then((res) => {
                var address = search.value;
                var a = address.split(",");
                var flag = 0;
                res.forEach((i) => {
                    if (i.address === a[0] && i.city === a[1] && i.state === a[2] && "Pincode:-" + i.pincode === a[3]) {
                        window.sessionStorage.setItem("address", address);
                        window.sessionStorage.setItem("rest_contact", i.contact)
                        window.sessionStorage.setItem("rest_id", i.rest_id);
                        window.location.href = "menu.html";
                        flag = 1;
                    }
                })
                if (flag === 0) {
                    alertBox("Error", "Enter a Valid Location", "#f44336");
                }
            })
    } else {
        alertBox("Info", "Enter a Location", "#ff9800");
    }
}

var user = JSON.parse(sessionStorage.getItem("user"));
if (user != null) {
    document.getElementById("logn").style.display = "none";
    document.getElementById("dropdown").style.display = "block";
    document.getElementById("dropbtn").innerHTML = user.name;
    document.getElementById('noti').style.display = "block";
}


function logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('notify');
    window.location.href = "welcome.html";
    // alert("Succefully Logout");
}

var modal = document.querySelector('.notify');
var b = document.getElementById('noti-img');

function showNotify() {
    if (modal.style.display === "block")
        modal.style.display = "none";
    else
        modal.style.display = "block"
}
window.onclick = function(event) {
    if (event.target != b) {
        modal.style.display = "none";
    }
}

function displayNotify() {

    var d = sessionStorage.getItem('notify');
    if (d != null) {
        document.querySelector('.count').style.display = "block";
        document.getElementById('not-det').innerHTML = `<div class="ord-det">Your order has been placed at ${d}</div>`
    } else {
        document.querySelector('.count').style.display = "none";
        document.getElementById('not-det').innerHTML = `<div class="ord-det">No Notification</div>`
    }

}

displayNotify();

function clearNotify() {
    sessionStorage.removeItem("notify");
    displayNotify();
}


function required(input) {
    if (input.length == 0) {
        return false;
    }
    return true;
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
// -----------------------------------------------------

function feedback() {
    var feed_name = document.getElementById('feed_name').value;
    var feed_email = document.getElementById('feed_email').value;
    var feed_msg = document.getElementById('feed_msg').value;
    if (required(feed_name) && required(feed_email) && required(feed_msg) && allLetter(feed_name) && validateEmail(feed_email)) {
        var urlencoded = new URLSearchParams();
        urlencoded.append("name", feed_name);
        urlencoded.append("email", feed_email);
        urlencoded.append("msg", feed_msg);

        fetch("http://localhost:9000/api/feedback/save", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlencoded
            })
            .then(
                document.getElementById('feed_name').value = "",
                document.getElementById('feed_email').value = "",
                document.getElementById('feed_msg').value = "",
                alertBox("Success", "Feedback Sent", "#4CAF50")
            );
    } else {
        if (feed_name.length === 0)
            alertBox("Info", "Enter Your Name", "#ff9800")
        else if (feed_email.length === 0)
            alertBox("Info", "Enter Your Email", "#ff9800")
        else if (feed_msg.length === 0)
            alertBox("Info", "Enter Your Message", "#ff9800")
        else if (!allLetter(feed_name))
            alertBox("Error", "Wrong Name", "#f44336")
        else if (!validateEmail(feed_email))
            alertBox("Error", "Wrong Email Address", "#f44336")
    }
}