const address = sessionStorage.getItem("address");
if (address == null) window.location.href = "welcome.html";
const addressArr = address.split(",");
var output = `
${addressArr[0]} , ${addressArr[1]} , ${addressArr[2]}&nbsp;<br>
        ${addressArr[3]}
`;
document.getElementById("address").innerHTML = output;

fetch(`http://localhost:9000/api/menu/showmenucat`)
  .then((data) => data.json())
  .then((res) => {
    var output = "";
    showMenu(res[0].id, res[0].category);
    res.forEach((i) => {
      output += `
    <items onclick = "showMenu(${i.id},'${i.category}')" style="cursor: pointer;font-weight:700">${i.category}</items><br>
    `;
    });
    document.getElementById("cat").innerHTML = output;
  });

function showMenu(id, category) {
  if (id === null) {
    console.log("id");
  }

  document.getElementById("view").innerHTML = `<h3>${category}</h3><hr>`;
  fetch(`http://localhost:9000/api/menu/${id}`)
    .then((data) => data.json())
    .then((res) => {
      var output = "";
      res.data.forEach((i) => {
        output += `
    <div class="card">
            <div class="card-img">
                <img src="../uploads/${i.photo}" width="240px" height="135px">
            </div>
            <div class="card-details">
                ${i.name}<br>
                Rs ${i.price}
            </div>
            <div class="card-add">
                <button data-name="${i.name}" data-price="${i.price}" onclick="addToCart(${i.id})" id="addToCart${i.id}"> Add To Cart </button>
            </div>
      </div>
    `;
      });
      document.getElementById("fav").innerHTML = output;
    });
}

var foodCart = (function () {
  cart = [];

  function Item(id, name, price, count) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.count = count;
  }

  function saveCart() {
    sessionStorage.setItem("foodCart", JSON.stringify(cart));
  }

  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem("foodCart"));
  }
  if (sessionStorage.getItem("foodCart") != null) {
    loadCart();
  }

  var obj = {};

  obj.addItemToCart = function (id, name, price, count) {
    for (var item in cart) {
      if (cart[item].id === id) {
        cart[item].count++;
        saveCart();
        return;
      }
    }
    var item = new Item(id, name, price, count);
    cart.push(item);
    saveCart();
  };

  obj.setCountForItem = function (id, count) {
    for (var i in cart) {
      if (cart[i].id === id) {
        cart[i].count = count;
        break;
      }
    }
  };

  obj.removeItemFromCart = function (id) {
    for (var item in cart) {
      if (cart[item].id === id) {
        cart[item].count--;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  };

  obj.removeItemFromCartAll = function (id) {
    for (var item in cart) {
      if (cart[item].id === id) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  obj.clearCart = function () {
    cart = [];
    saveCart();
  };

  obj.totalCount = function () {
    var totalCount = 0;
    for (var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  obj.totalCart = function () {
    var totalCart = 0;
    for (var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  };

  obj.listCart = function () {
    var cartCopy = [];
    for (i in cart) {
      item = cart[i];
      itemCopy = {};
      for (p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };

  return obj;
})();

function addToCart(id) {
  var id = id;
  var name = document
    .getElementById(`addToCart${id}`)
    .getAttribute("data-name");
  var price = document
    .getElementById(`addToCart${id}`)
    .getAttribute("data-price");
  foodCart.addItemToCart(id, name, price, 1);
  displayCart();
}

function clearCart() {
  foodCart.clearCart();
  displayCart();
}

function displayCart() {
  var cartArray = foodCart.listCart();
  var out = "";
  for (var i in cartArray) {
    out += `
    <tr>
      <td style="font-size: 18px;">${cartArray[i].name}</td>
      <td>Rs ${cartArray[i].price}</td>
      <td><button class="qty" onclick="plusItem(${cartArray[i].id})">+</button><input type="text" class="qty-input" value=${cartArray[i].count} id="it-count"><button class="qty" onclick="minusItem(${cartArray[i].id})">-</button></td>
      <td>Rs ${cartArray[i].total}</td>
      <td><button onclick="deleteItem(${cartArray[i].id})" id="deleteItem">Remove</button></td>
    </tr>
    `;
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
  `;
  document.getElementById("show-cart").innerHTML = output;
  document.getElementById("total-cart").innerHTML = foodCart.totalCart();
  document.getElementById("total-count").innerHTML = foodCart.totalCount();
}

function deleteItem(id) {
  foodCart.removeItemFromCartAll(id);
  displayCart();
}

function plusItem(id) {
  foodCart.addItemToCart(id);
  displayCart();
}

function minusItem(id) {
  foodCart.removeItemFromCart(id);
  displayCart();
}

displayCart();

var modal = document.getElementById("myModal");
var btn = document.getElementById("mybtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
  modal.style.display = "block";
};
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

var user = JSON.parse(sessionStorage.getItem("user"));

function checkout() {
  var n = foodCart.totalCart();
  if (n != 0) {
    if (user != null) {
      window.location.href = "checkout.html";
    } else {
      window.location.href = "login.html?redirect_page=menu";
    }
  } else {
    alertBox("Info", "Cart is Empty", "#ff9800");
  }
}

if (user != null) {
  document.getElementById("logn").style.display = "none";
  document.getElementById("dropdown").style.display = "block";
  document.getElementById("dropbtn").innerHTML = user.name;
}

function logout() {
  sessionStorage.removeItem("user");
  window.location.href = "menu.html";
}

function alertBox(header, msg, color) {
  var alert = document.getElementById("alert");
  var res = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
  <strong>${header}!</strong> ${msg}.`;
  alert.innerHTML = res;
  alert.style.backgroundColor = color;
  alert.style.display = "block";
}
