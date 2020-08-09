var admin = JSON.parse(sessionStorage.getItem('admin'));
if (admin == null)
    window.location.href = "admin.html";

function logout() {
    sessionStorage.removeItem('admin');
    window.location.href = "admin.html";

}
const a = {};
fetch(`http://localhost:9000/api/order/showAll`)
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
                a[i.id] = { id: i.id, cname: i.cname, caddress: i.caddress, cphone: i.cphone, cemail: i.cemail, notes: i.notes, schedule: i.schedule, name: [], price: [], quantity: [], branch_address: i.branch_address, branch_contact: i.branch_contact };
                a[i.id].name.push(i.name)
                a[i.id].price.push(i.price);
                a[i.id].quantity.push(i.quantity);
            }
            // console.log(a[i.id]);
        })
        var output = `<table style="margin: 10px; margin-top:70px;">
        <tr>
            <th>Order id</th>
            <th>Customer Name</th>
            <th>Customer Address</th>
            <th>Total</th>
            <th>Schedule</th>
            <th>Notes</th>
            <th>Contact</th>
            <th>Branch Address</th>
            <th>Branch Contact</th>
            <th>View</th>
        </tr>`;
        for (var j in a) {
            var price = a[j].price;
            var quantity = a[j].quantity;
            output += `
            <tr>
            <td>${j}</td>
            <td>${a[j].cname}</td>
            <td>${a[j].caddress}</td>
            <td>Rs ${renderTotal(price,quantity)}</td>
            <td>${a[j].schedule}</td>
            <td>${a[j].notes}</td>
            <td>${a[j].cphone}</td>
            <td>${a[j].branch_address}</td>
            <td>${a[j].branch_contact}</td>
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
    `
    document.getElementById('food').innerHTML = output;
    document.getElementById('food').style.display = "block";
}

function renderTotal(price, quantity) {
    var total = 0;
    var i = 0;
    for (i = 0; i < price.length; i++) {
        total += price[i] * quantity[i];
    }
    return total;
}