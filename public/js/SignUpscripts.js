//Used for instant display of profile image
var updatePic = function (event) {
    document.getElementById('profile').src = URL.createObjectURL(event.target.files[0]);
};

var unameStatus = false;
function unameConfirm(){
	if(document.getElementById("username").value != ""){
	
	var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", "/get?target=users&username="+document.getElementById("username").value, true);
    xhr.onload = function() {
        if (this.status === 200) {
			if(this.response[0] == undefined){
				document.getElementById("unameComp").innerText = "";
				unameStatus = true;
			}
			else{
				document.getElementById("unameComp").innerText = "This username is already taken.";
                unameStatus = false;
			}
        }
    };
    xhr.send();	
	}
	else{
		document.getElementById("unameComp").innerText = "Please enter a username";
        unameStatus = false;
	}
};

function pwdConfirm(){
	if(document.getElementById("passwordFirst").value == document.getElementById("passwordConf").value){
		document.getElementById("pwdComp").innerText = "";
		return true;
	}
	else{
		document.getElementById("pwdComp").innerText = "Passwords are different.";
		return false;
	}
	
};

function imgConfirm() {
    const file = document.getElementById('profPic').files[0];
    if (file != null){
        return true;
    } else {
        return false;
    }
}

function signUp(event){
	if (unameStatus && pwdConfirm() && imgConfirm()) {
		//pass in everything to be added to db, pwds match and uname is unique
        getS3PutSignedRequest();
	}
	else{
		console.log('hi')
		document.getElementById("pwdComp").style.backgroundColor = '#FF7777';
		document.getElementById("unameComp").style.backgroundColor = '#FF7777';
	}
}

function getS3PutSignedRequest() {
    const username = document.getElementById('username').value;
    const file = document.getElementById('profPic').files[0];
	var fileName;

	if (file.type == 'image/png') {
		fileName = `${username}.png`
	} else {
		fileName = `${username}.jpg`
	}

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/s3?action=put&fileName=${fileName}&fileType=${file.type}`);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                const response = JSON.parse(xhr.responseText);
                addImageToS3(file, fileName, response.signedRequest);
            }
            else{
                // error
				console.log('ERROR PUT S3')
            }
        }
    };
    xhr.send();
}

function addImageToS3(file, fileName, signedRequest) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
				addUserToDb(fileName);
            }
            else{
                // error
				console.log("error add image")
            }
        }
    };
    xhr.send(file);
}

function addUserToDb(fileName) {
	var accountType;
	if(document.getElementById("student").checked){
		accountType = document.getElementById("student").value;
	}
	else{	
		accountType = document.getElelmentById("teacher").value;
	}
	
    var data = {
        target: 'newUser',
        username: document.getElementById('username').value,
        password: document.getElementById('passwordConf').value,
        firstname: document.getElementById('signUpFirstName').value,
        lastname: document.getElementById('signUpLastName').value,
        picname: fileName,
        acctype: accountType
    };
    var xhrDb = new XMLHttpRequest();
    xhrDb.responseType = "json";
    xhrDb.open("POST", "/post", true);
    xhrDb.onload = function() {
        if (this.status === 200) {
            // TODO: do sth when success
        	console.log("YAYYYYY")

        } else {
            // TODO: do sth when error
            console.log("add fail. cry")
        }
    }
    xhrDb.send(JSON.stringify(data));
}


function profileChangePwd(){
	if(pwdConfirm()){
		//make post request
		
	}
	else{
		document.getElementById("pwdComp").style.backgroundColor = '#FF7777';
		
	}
};

