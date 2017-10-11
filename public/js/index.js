// function logIn(){
//     var xhr = new XMLHttpRequest();
//     xhr.responseType = "json";
//     xhr.open("GET", "/get?target=userByCourseCode&courseCode=MU-101-A17&filter=professor", true);
//     xhr.onload = function() {
//         if (this.status === 200) {
//             validateUser();
//         }
//     };
//     xhr.send();
// }

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