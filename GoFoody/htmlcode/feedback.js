var admin = JSON.parse(sessionStorage.getItem('admin'));
if (admin == null)
    window.location.href = "admin.html";

function logout() {
    sessionStorage.removeItem('admin');
    window.location.href = "admin.html";

}


fetch(`http://localhost:9000/api/feedback/showFeed`)
    .then((data) => data.json())
    .then((res) => {
        var output = ` <table style="margin: 10px;margin-top: 70px;">
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
        </tr>`;
        res.data.forEach((i) => {
            output += `
    <tr>
    <td>${i.name}</td>
    <td>${i.email}</td>
    <td>${i.msg}</td>
  </tr>
    `
        });
        output += `</table>`
        document.getElementById('feed').innerHTML = output;
    });