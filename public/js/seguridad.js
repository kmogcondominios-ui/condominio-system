const token = localStorage.getItem("token");

if(!token){

    window.location.href =
        "login.html";

}

function salir(){

    localStorage.removeItem("token");

    window.location.href =
        "login.html";

}