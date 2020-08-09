var user = JSON.parse(sessionStorage.getItem("user"));
var restid = sessionStorage.getItem("rest_id");
var branch_address = sessionStorage.getItem("address");
var branch_contact = sessionStorage.getItem("rest_contact");
if (user === null)
    window.location.href = "welcome.html";
var schedule = JSON.parse(sessionStorage.getItem("schedule"));
var foodCart = JSON.parse(sessionStorage.getItem("foodCart"));
if (user != null) {
    document.getElementById("dropbtn").innerHTML = user.name;
}


cart = [];

function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('foodCart'));
}
if (sessionStorage.getItem("foodCart") != null) {
    loadCart();
}

function totalCart() {
    var totalCart = 0;
    for (var item in cart) {
        totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
}

function csgst() {
    var n = totalCart();
    var c = 2.5 / 100 * n;
    var res = c.toFixed(2);
    return res;
}
var total = totalCart() + 2 * csgst();
document.getElementById('sub-total').innerHTML = `Rs ${totalCart()}`;
document.getElementById('cgst').innerHTML = `Rs ${csgst()}`;
document.getElementById('sgst').innerHTML = `Rs ${csgst()}`;
document.getElementById('total').innerHTML = `Rs ${total}`;

function addOrder() {
    var id = user.id;
    var sch = JSON.stringify(schedule.scheduleOrder);
    var notes = schedule.Notes

    var urlencoded = new URLSearchParams();
    urlencoded.append("userid", id);
    urlencoded.append("restid", restid);
    urlencoded.append("schedule", sch);
    urlencoded.append("notes", notes);
    urlencoded.append("branch_address", branch_address)
    urlencoded.append("branch_contact", branch_contact)
    if (document.getElementById("by-cash").checked) {
        fetch("http://localhost:9000/api/order/details", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlencoded
            })
            .then((data) => data.json())
            .then((res) => {
                custDetails(res.insertId);
                foodDet(res.insertId);
                pay(res.insertId);
                window.location.href = "welcome.html";
                sessionStorage.removeItem("foodCart");
                sessionStorage.removeItem("schedule");
                window.location.href = "welcome.html";
            });
        var d = new Date();
        var n = d.toUTCString();
        sessionStorage.setItem("notify", n);
    } else {
        alertBox("Info", "Select A Payment Mode", "#ff9800")
    }
}

function custDetails(id) {

    var cname = schedule.custDet.name;
    var cphone = schedule.custDet.phone;
    var caddress = schedule.custDet.address;
    var cemail = schedule.custDet.email;

    var urlencoded = new URLSearchParams();
    urlencoded.append("cname", cname);
    urlencoded.append("cphone", cphone);
    urlencoded.append("caddress", caddress);
    urlencoded.append("cemail", cemail);
    urlencoded.append("orderid", id);

    fetch("http://localhost:9000/api/order/custdet", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded
        })
        .then((response) => {
            console.log(response.status);
        })
}

function foodDet(id) {
    for (var items in cart) {

        var urlencoded = new URLSearchParams();
        urlencoded.append("orderid", id);
        urlencoded.append("quantity", cart[items].count);
        urlencoded.append("name", cart[items].name);
        urlencoded.append("price", cart[items].price);

        fetch("http://localhost:9000/api/order/fooddet", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlencoded
            })
            .then((response) => {
                console.log(response.status);
            })


    }
}

function pay(id) {
    var uid = user.id;
    var subTotal = totalCart();
    var payMode;
    if (document.getElementById("by-cash").checked) {
        payMode = "By Cash";
    }
    var urlencoded = new URLSearchParams();
    urlencoded.append("subTotal", subTotal);
    urlencoded.append("mode", payMode);
    urlencoded.append("orderid", id);
    urlencoded.append("userid", uid);
    fetch("http://localhost:9000/api/payment/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded
        })
        .then((response) => {
            console.log(response.status);
        })
}

function alertBox(header, msg, color) {
    var alert = document.getElementById('alert');
    var res = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
  <strong>${header}!</strong> ${msg}.`
    alert.innerHTML = res;
    alert.style.backgroundColor = color
    alert.style.display = "block";
}

function logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('notify');
    window.location.href = "welcome.html";
    alert("Succefully Logout");
}