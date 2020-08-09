var user = JSON.parse(sessionStorage.getItem("user"));
if (user === null)
    window.location.href = "welcome.html";

var user = JSON.parse(sessionStorage.getItem("user"));
var foodCart = JSON.parse(sessionStorage.getItem("foodCart"));
if (user != null) {
    document.getElementById("dropbtn").innerHTML = user.name;
}

function logout() {
    sessionStorage.removeItem('user');
    window.location.href = "menu.html";
    // alert("Succefully Logout");
}


var foodCart = (function() {

    cart = [];

    function saveCart() {
        sessionStorage.setItem('foodCart', JSON.stringify(cart));
    }

    function loadCart() {
        cart = JSON.parse(sessionStorage.getItem('foodCart'));
    }
    if (sessionStorage.getItem("foodCart") != null) {
        loadCart();
    }
    var obj = {}
    obj.removeItemFromCartAll = function(id) {
        for (var item in cart) {
            if (cart[item].id === id) {
                cart.splice(item, 1);
                break;
            }
        }
        saveCart();
    }
    obj.totalCart = function() {
        var totalCart = 0;
        for (var item in cart) {
            totalCart += cart[item].price * cart[item].count;
        }
        return Number(totalCart.toFixed(2));
    }
    obj.listCart = function() {
        var cartCopy = [];
        for (i in cart) {
            item = cart[i];
            itemCopy = {};
            for (p in item) {
                itemCopy[p] = item[p];

            }
            itemCopy.total = Number(item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy)
        }
        return cartCopy;
    }
    return obj;

})();




function displayCart() {
    var cartArray = foodCart.listCart();
    var out = "";
    for (var i in cartArray) {
        out += `
      <tr>
        <td style="font-size: 18px;">${cartArray[i].name}</td>
        <td width=65px>Rs ${cartArray[i].price}</td>
        <td><input type="text" class="qty-input" value=${cartArray[i].count} id="it-count"></td>
        <td width=65px>Rs ${cartArray[i].total}</td>
        <td><button onclick="deleteItem(${cartArray[i].id})" id="deleteItem">Remove</button></td>
      </tr>
      `
    }
    var output = `
    <table>
              <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
              </tr>
              ${out}
          </table>
    `
    document.getElementById('show-cart').innerHTML = output;
    document.getElementById('total-cart').innerHTML = foodCart.totalCart();
}
displayCart();

function deleteItem(id) {
    foodCart.removeItemFromCartAll(id);
    displayCart();
}


document.getElementById('name').value = user.name;
document.getElementById('phone-no.').value = user.contact;
document.getElementById('address').value = user.address;
document.getElementById('e-mail').value = user.email;





var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
var min = yyyy + '-' + mm + '-' + dd;


var later = today;
later.setDate(later.getDate() + 5);
var dd = later.getDate();
var mm = later.getMonth() + 1;
var yyyy = later.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
var max = yyyy + '-' + mm + '-' + dd;
document.getElementById("date").min = min;
document.getElementById("date").max = max;

function schedule() {
    if (document.getElementById('now').checked) {
        document.getElementById('order-later').style.display = "none";
    } else if (document.getElementById('later').checked)
        document.getElementById('order-later').style.display = "block";
}

function pay() {
    var sc = '';
    if (document.getElementById('now').checked) {
        today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        if (time > "10: 00: 00" && time < "20: 00: 00") {
            sc = date + " " + time
        } else {
            alertBox("Info", "Inservicable", "#ff9800")
            return;
        }
    } else if (document.getElementById('later').checked) {
        var date = document.getElementById("date").value
        if (date === "") {
            alertBox("Info", "Enter a Date to Deliver", "#ff9800");
            return;
        }
        var time = document.getElementById("time").value
        if (time > "10: 00: 00" && time < "20: 00: 00") {
            sc = date + " " + time
        } else {
            alertBox("Info", "Enter Time between 10:00 AM to 8:00 PM", "#ff9800")
            return;
        }
    }
    var order = {
        custDet: {
            name: document.getElementById("name").value,
            email: document.getElementById("e-mail").value,
            phone: document.getElementById("phone-no.").value,
            address: document.getElementById("address").value
        },
        scheduleOrder: sc,
        Notes: document.getElementById("notes").value
    }
    if (required(order.custDet.name) && required(order.custDet.email) && required(order.custDet.phone) && required(order.custDet.address) && required(order.scheduleOrder) && allLetter(order.custDet.name) && validateEmail(order.custDet.email) && phonenumber(order.custDet.phone)) {
        sessionStorage.setItem("schedule", JSON.stringify(order));
        window.location.href = "payment.html";
    } else {
        if (!required(order.custDet.name))
            alertBox("Info", "Enter Your Name", "#ff9800");
        else if (!required(order.custDet.email))
            alertBox("Info", "Enter Your Email", "#ff9800");
        else if (!required(order.custDet.phone))
            alertBox("Info", "Enter Your Phone", "#ff9800");
        else if (!required(order.custDet.address))
            alertBox("Info", "Enter Your Address", "#ff9800");
        else if (!required(order.scheduleOrder))
            alertBox("Info", "Enter the Schedule Order", "#ff9800");
        else if (!allLetter(order.custDet.name))
            alertBox("Error", "Wrong Name", "#f44336");
        else if (!validateEmail(order.custDet.email))
            alertBox("Error", "Wrong Email Address", "#f44336");
        else if (!phonenumber(order.custDet.phone))
            alertBox("Error", "Wrong Contact", "#f44336");
    }

}

// ------------------------------------------------


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