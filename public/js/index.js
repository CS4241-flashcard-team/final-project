function checkLoggedIn() {
    if (localStorage.getItem("username") !== null) {
        window.location.href = "/dashboard.html";
    }
}
checkLoggedIn();

function logIn(){
    const data = {
        target: 'logIn',
        username: document.getElementById('userName').value,
        password: document.getElementById('password').value
    };
    var html = '';
    var alert;
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", "/post", true);
    xhr.onload = function() {
        if (this.status === 400) {
            console.log(this.response.message);
            html += '<div class="alert alert-danger alert-dismissable">';
            html += '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
            html += '<strong>Error! :( </strong>' + this.response.message;
            html += '</div>';
            alert = document.querySelector('#logIn-alert');
            alert.innerHTML = html;
            alert.style.display = '';
        }

        if (this.status === 200) {
            window.localStorage.setItem('username', document.getElementById('userName').value);
            window.location.href = "dashboard.html";
            console.log('yay');
        }
    };
    xhr.send(JSON.stringify(data));
}

function checkLogIn() {
    var html = '';
    var alert = document.querySelector('#logIn-alert');

    if (document.querySelector('#userName').value && document.querySelector('#userName').value) {
        logIn()
    } else  {
        // error alert
        html += '<div class="alert alert-danger alert-dismissable">';
        html += '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
        html += '<strong>Error! :( </strong> Username and Password cannot be empty!';
        html += '</div>';
        alert.innerHTML = html;
        alert.style.display = '';
    }
}
// function validateUser(){
//     var userName = document.getElementById('userName');
//     console.log(userName);
//     var password = document.getElementById('password');
//     console.log(password);

//     if (userName == "") {
//         alert("Name must be filled out");
//     }
//     else if (password == "") {
//         alert("Password must be filled out");
//     }
//     else if (username == "Formget" && password == "formget#123"){
//         alert ("Login successfully");
//         window.location = "dashboard.html";
//     }
// }