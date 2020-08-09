var rest = JSON.parse(sessionStorage.getItem('rest'));

if (rest == null)
    window.location.href = "restaurant.html";

function logout() {
    sessionStorage.removeItem('rest');
    window.location.href = "restaurant.html";

}
const a = {};
fetch(`http://localhost:9000/api/order/showOnRest/${rest.rest_id}`)
    .then((data) => data.json())
    .then((res) => {
        // var a = {};
        res.forEach((i) => {
            if (a[i.id]) {
                // a[i.id].id.push(i.id);
                a[i.id].name.push(i.name);
                a[i.id].price.push(i.price);
                a[i.id].quantity.push(i.quantity);
            } else {
                a[i.id] = { id: i.id, cname: i.cname, caddress: i.caddress, cphone: i.cphone, cemail: i.cemail, notes: i.notes, schedule: i.schedule, name: [], price: [], quantity: [], flag: i.flag };
                a[i.id].name.push(i.name)
                a[i.id].price.push(i.price);
                a[i.id].quantity.push(i.quantity);
            }
        })
        var output = `<table style="margin-top: 0px;">
        <tr>
            <th>Order id</th>
            <th>Customer Name</th>
            <th>Customer Contact</th>
            <th>Customer Address</th>
            <th>Customer Email</th>
            <th>Schedule</th>
            <th>Notes</th>
            <th>Total</th>
            <th>View</th>
        </tr>`;
        for (var j in a) {
            var price = a[j].price;
            var quantity = a[j].quantity;
            output += `
                <tr>
                <td>${j}</td>
                <td>${a[j].cname}</td>
                <td>${a[j].cphone}</td>
                <td>${a[j].caddress}</td>
                <td>${a[j].cemail}</td>
                <td>${a[j].schedule}</td>
                <td>${a[j].notes}</td>
                <td>Rs ${renderTotal(price,quantity)}</td>
                <td><button onclick="renderAllFood(${j})">View</button></td>
            </tr>
                `
        }
        output += ` </table>`;
        document.getElementById('order').innerHTML = output;
    })

function renderAllFood(j) {
    var output = `
   <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
        <table style="margin-top:0px">
            <tr>
                <th>Food</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
   `
    var food = a[j].name;
    var quantity = a[j].quantity;
    var price = a[j].price;
    var flag = a[j].flag;

    var i = 0;
    for (i = 0; i < food.length; i++) {
        output += `
       <tr>
                <td>${food[i]}</td>
                <td>${quantity[i]}</td>
                <td>Rs ${price[i]}</td>
            </tr>
       `
    }
    output += `
    </table> 
    <div style="background-color:white;padding: 15px;font-size: 17px;font-weight: 600;">
    <input type="checkbox" id="reject">Reject
    <input type="checkbox" style="margin-left: 80px;" id="accept">Accept<br><br>
    <textarea placeholder="Message for Rejection" style="width: 90%;height: 80px; display: none;" id="textarea"></textarea>
    <input type="checkbox" id="preparing">Preparing
    <input type="checkbox" style="margin-left: 54px;" id="outDelivery">Out for Delivery&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <input type="checkbox" id="delivered">Delivered
    </div>
    `
    document.getElementById('food').innerHTML = output;
    document.getElementById('food').style.display = "block";
    checkBox(flag);
}

function checkBox(flag) {
    console.log(flag);
    var reject = document.getElementById('reject');
    var accept = document.getElementById('accept');
    var preparing = document.getElementById('preparing');
    var outDelivery = document.getElementById('outDelivery');
    var delivered = document.getElementById('delivered');
    var textarea = document.getElementById('textarea')
    if (flag === -1) {
        reject.checked = true;
        reject.disabled = true;
        accept.disabled = true;
        preparing.disabled = true;
        outDelivery.disabled = true;
        delivered.disabled = true;
        textarea.value = "No items available"
        textarea.style.display = "block"
        textarea.disabled = true;
    } else if (flag === 1) {
        reject.disabled = true;
        accept.checked = true;
        accept.disabled = true;
    } else if (flag === 2) {
        reject.disabled = true;
        accept.checked = true;
        accept.disabled = true;
        preparing.checked = true;
        preparing.disabled = true;
    } else if (flag === 3) {
        reject.disabled = true;
        accept.checked = true;
        accept.disabled = true;
        preparing.checked = true;
        preparing.disabled = true;
        outDelivery.checked = true;
        outDelivery.disabled = true;
    } else if (flag === 4) {
        reject.disabled = true;
        accept.checked = true;
        accept.disabled = true;
        preparing.checked = true;
        preparing.disabled = true;
        outDelivery.checked = true;
        outDelivery.disabled = true;
        delivered.checked = true;
        delivered.disabled = true;
    }

}

function renderTotal(price, quantity) {
    var total = 0;
    var i = 0;
    for (i = 0; i < price.length; i++) {
        total += price[i] * quantity[i];
    }
    return total;
}