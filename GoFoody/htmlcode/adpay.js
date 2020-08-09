var admin = JSON.parse(sessionStorage.getItem('admin'));
if(admin == null)
window.location.href = "admin.html";

function logout(){
    sessionStorage.removeItem('admin');
    window.location.href="admin.html";
    
}

fetch(`http://localhost:9000/api/payment/details`)
.then((data) => data.json())
.then((res) =>{
  var output = ` <table style="margin: 10px;margin-top: 70px;">
                <tr>
                <th>Order Id</th>
                <th>Customer Name</th>
                <th>Mode</th>
                <th>Total</th>
                </tr>`;
  res.forEach((i) => {
    output += `
    <tr>
    <td>${i.orderid}</td>
    <td>${i.name}</td>
    <td>${i.mode}</td>
    <td>${i.subtotal}</td>
  </tr>
    `
  });
  output +=`</table>`
  document.getElementById('showPay').innerHTML = output;
});