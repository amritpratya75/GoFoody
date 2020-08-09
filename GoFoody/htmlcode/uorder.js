var user = JSON.parse(sessionStorage.getItem("user"));
if (user === null)
    window.location.href = "welcome.html"

document.getElementById('dropbtn').innerHTML = `${user.name}`;

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


function shoew() {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            console.log("Heeee")
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

function renderFood(foodItem) {
    var output = '';
    foodItem.forEach((i) => {
        output += `${i}<br>`;
    })
    return output;
}

function renderPrice(price) {
    var output = '';
    price.forEach((i) => {
        output += `Rs ${i}<br>`;
    })
    return output;
}

function total(price, quantity) {
    var total = 0;
    var i = 0;
    for (i = 0; i < price.length; i++) {
        total += price[i] * quantity[i];
    }
    return total;
}

fetch(`http://localhost:9000/api/order/show/${user.id}`)
    .then((data) => data.json())
    .then((res) => {
        var a = {};
        res.forEach((i) => {
            if (a[i.id]) {
                // a[i.id].id.push(i.id);
                a[i.id].name.push(i.name);
                a[i.id].price.push(i.price);
                a[i.id].quantity.push(i.quantity);
            } else {
                var date = i.date_time.split('T');
                var date_time = date[0] + " " + date[1].slice(0, -8);
                a[i.id] = { id: i.id, date_time: date_time, cname: i.cname, caddress: i.caddress, cphone: i.cphone, cemail: i.cemail, notes: i.notes, schedule: i.schedule, name: [], price: [], quantity: [], branch_address: i.branch_address, branch_contact: i.branch_contact };
                a[i.id].name.push(i.name)
                a[i.id].price.push(i.price);
                a[i.id].quantity.push(i.quantity);
            }
            // console.log(a[i.id]);
        })
        var output = '';
        for (var j in a) {
            var food = a[j].name;
            var price = a[j].price;
            var quantity = a[j].quantity;
            var branch = a[j].branch_address.split(",");
            output += `
            <div>
            <button type="button" class="collapsible">Order Id:${j} <br>Order Time:${a[j].date_time}</button>
            <div class="content">
                <div id="cust-details" style="display: grid;grid-template-columns: 1fr 1fr;line-height: 22px;padding-top: 10px;">
                    <div class="det_head">
                    Delivery Details
                        <hr> Name:
                        <br> Email:
                        <br> Phone:
                        <br> Address:
                        <br>Schedule:
                        <br>Notes:
                        <br>
                    </div>
                    <div>
                        <br>
                        <hr> ${a[j].cname}
                        <br> ${a[j].caddress}
                        <br> ${a[j].cphone}
                        <br> ${a[j].cemail}
                        <br>${a[j].schedule}
                        <br>${a[j].notes}
                        <br>
                    </div>
                </div>
                <hr>
                <div id="food order" style="display: grid;grid-template-columns: 3fr 1fr 1fr;line-height: 22px;">
                    <div>
                        <span class="det_head">Food Details</span>

                        <hr> ${renderFood(food)}
                    </div>
                    <div>
                    <span class="det_head">Quantity&nbsp;&nbsp;</span>
                        <hr>${renderFood(quantity)}
                        <hr><span class="det_head">Total:</span>
                    </div>
                    <div>
                    <span class="det_head">Price</span>
                        <hr>${renderPrice(price)}
                        <hr> Rs ${total(price,quantity)}
                    </div>
                </div>
                <hr>
                <div id="rest-details" style="display: grid;grid-template-columns: 1fr 1fr;line-height: 22px;">
                    <div class="det_head">
                        Restaurant Details
                        <hr> Branch Address
                        <br><br><br>
                        <br> Branch Contact
                        <br>
                    </div>
                    <div>
                        <br>
                        <hr> ${branch[0]},<br>${branch[1]},<br>${branch[2]},<br>${branch[3]}
                        <br> ${a[j].branch_contact}
                        <br>
                    </div>
                </div>
            </div>
        </div>   
            `
        }
        document.getElementById('maina').innerHTML = output;
        shoew();
    })