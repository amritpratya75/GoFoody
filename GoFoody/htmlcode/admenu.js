var admin = JSON.parse(sessionStorage.getItem('admin'));
if (admin == null)
    window.location.href = "admin.html";

function logout() {
    sessionStorage.removeItem('admin');
    window.location.href = "admin.html";

}

// ---------------------------------------------------
function showCategory() {
    fetch(`http://localhost:9000/api/menu/showmenucat`)
        .then((data) => data.json())
        .then((res) => {
            var output = ` <table>
                <tr>
                <th>Category</th>
                <th>Remove</th>
                </tr>`;
            res.forEach((i) => {
                output += `
              <tr>
                <td>${i.category}</td>
                <td><button onclick= "removeCategory(${i.id})">X</button></td>
              </tr>
    `
            });
            output += `</table>`
            document.getElementById('category').innerHTML = output;
        });
}
// ---------------------------------------------------

// ---------------------------------------------------
function addCategory() {
    var category = document.getElementById('cat_name').value;
    if (required(category)) {
        var urlencoded = new URLSearchParams();
        urlencoded.append("category", category);

        fetch("http://localhost:9000/api/menu/addmenucat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlencoded
            })
            .then(response => {
                var status = response.status;
                if (status === 200) {
                    showCategory();
                    reset();
                    selectCat();
                }
            })
    } else {
        if (!required(category))
            alertBox("Info", "Enter Category", "#ff9800")
    }
}

// ---------------------------------------------------


function reset() {
    document.getElementById('cat_name').value = "";
}
showCategory();

// ---------------------------------------------------
function selectCat() {
    fetch(`http://localhost:9000/api/menu/showmenucat`)
        .then((data) => data.json())
        .then((res) => {
            var output = ` <select id="menu" oninput="myFunc()" style="font-size: 15px;">`;
            res.forEach((i) => {
                output += `
        <option value="${i.id}">${i.category}</option>
        `
            });
            output += `</select>`
            document.getElementById('cate').innerHTML = output;
            myFunc();
        });
}
selectCat();
// ---------------------------------------------------

// ---------------------------------------------------


function myFunc() {
    var x = document.getElementById("menu");
    var n;
    if (x !== null) {
        var i = x.selectedIndex;
        console.log(i);
        n = x.options[i].value
    }
    fetch(`http://localhost:9000/api/menu/${n}`)
        .then((data) => data.json())
        .then((res) => {
            var output = `<table>
    <tr>
      <th>Menu</th>
      <th>Price</th>
      <th>Image</th>
      <th>Remove</th>
      <th>Edit</th>
    </tr>`;
            res.data.forEach((i) => {
                output += `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.price}</td>
                  <td>${i.photo}</td>
                  <td><button onclick="removeMenu(${i.id})">X</button></td>
                  <td><button onclick="editMenu(${i.id})">Edit</button></td>
                </tr>
      `
            });
            output += `</table>`
            document.getElementById('show_menu').innerHTML = output;
        });
}
myFunc();
// ---------------------------------------------------

// ---------------------------------------------------
function addMenu() {
    var name = document.getElementById("name").value;
    var price = document.getElementById("price").value;
    var fileInput = document.getElementById('images')

    var x = document.getElementById("menu");
    var i = x.selectedIndex;
    var n = x.options[i].value
    if (required(name) && required(price) && required(fileInput.value)) {
        var formdata = new FormData();
        formdata.append("image", fileInput.files[0], fileInput.value);
        formdata.append("name", name);
        formdata.append("price", price);
        formdata.append("menucatid", n);


        fetch("http://localhost:9000/api/menu/addmenu", {
                method: 'POST',
                body: formdata
            })
            .then(
                myFunc(),
                resetMenu()
            )
    } else {
        if (!required(name))
            alertBox("Info", "Enter Menu Name", "#ff9800")
        else if (!required(price))
            alertBox("Info", "Enter price", "#ff9800")
        else if (!required(fileInput.value))
            alertBox("Info", "Uplaod Menu Image", "#ff9800")
    }
}

function resetMenu() {
    document.getElementById('name').value = "";
    var price = document.getElementById("price").value = ""
    var fileInput = document.getElementById('images').value = ""
}
// ---------------------------------------------------

function removeCategory(id) {
    fetch(`http://localhost:9000/api/menu/deletemenucat/${id}`, {
            method: 'DELETE',
        })
        .then((data) => data.json())
        .then(
            showCategory(),
            selectCat(),
            myFunc()
        )
}
// ---------------------------------------------------


function removeMenu(id) {
    fetch(`http://localhost:9000/api/menu/${id}`, {
            method: 'DELETE',
        })
        .then((data) => data.json())
        .then(
            myFunc()
        )
}

// ---------------------------------------------------


// ---------------------------------------------------
function editMenu(id) {
    document.getElementById("myModal").style.display = "block";
    fetch(`http://localhost:9000/api/menu/category/${id}`)
        .then((data) => data.json())
        .then((res) => {
            res.forEach((i) => {
                document.getElementById("ed_name").value = i.name;
                document.getElementById("ed_price").value = i.price;
                document.getElementById("menuId").value = id;
            })
        })
}


function saveMenu() {
    var name = document.getElementById("ed_name").value;
    var price = document.getElementById("ed_price").value;
    var id = document.getElementById('menuId').value

    var urlencoded = new URLSearchParams();
    urlencoded.append("name", name);
    urlencoded.append("price", price);


    fetch(`http://localhost:9000/api/menu/updatemenu/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded
        })
        .then(response => {
            var status = response.status;
            if (status === 200) {
                document.getElementById("myModal").style.display = "none";
                myFunc();
            }
        })



}

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function required(input) {
    if (input.length == 0) {
        return false;
    }
    return true;
}



function alertBox(header, msg, color) {
    var alert = document.getElementById('alert');
    var res = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
  <strong>${header}!</strong> ${msg}.`
    alert.innerHTML = res;
    alert.style.backgroundColor = color
    alert.style.display = "block";
}