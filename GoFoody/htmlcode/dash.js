var admin = JSON.parse(sessionStorage.getItem('admin'));
console.log(admin);
if(admin == null)
window.location.href = "admin.html";


function logout(){
    sessionStorage.removeItem('admin');
    window.location.href="admin.html";
    
}
