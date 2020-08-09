var user = JSON.parse(sessionStorage.getItem("user"));
if (user === null)
    window.location.href = "welcome.html"

document.getElementById('dropbtn').innerHTML = `${user.name}`;

document.getElementById('prof-name').innerHTML = `
<span id="name" style="margin-left: 70px;"></span>${user.name}<br></span>
            <img src="./images/email.svg" width="25px" height="25px">&nbsp;&nbsp;
            <span id="email">${user.email}</span><br>
            <img src="./images/phone-contact.svg" width="25px" height="25px">&nbsp;&nbsp;
            <span id="phone">${user.contact}</span>
`


function logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('notify');
    window.location.href = "welcome.html";
    alert("Succefully Logout");
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