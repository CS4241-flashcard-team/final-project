function logIn(){
    const data = {
        target: 'logIn',
        username: document.getElementById('userName').value,
        password: document.getElementById('password').value
    };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", "/post", true);
    xhr.onload = function() {
        if (this.status === 400) {
            console.log(this.response.message);
        }

        if (this.status === 200) {
            console.log('yay');
        }
    };
    xhr.send(JSON.stringify(data));
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