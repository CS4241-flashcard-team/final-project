//Used for instant display of profile image
var updatePic = function (event) {
    document.getElementById('profile').src = URL.createObjectURL(event.target.files[0]);
};



function getProfileInfo(){
	var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", "/get?target=users&username=taylorSwift", true);
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(this.response);
			document.getElementById("uname").innerText = this.response[0].username;
			document.getElementById("first").innerText = this.response[0].firstname;
			document.getElementById("last").innerText = this.response[0].lastname;
			document.getElementById("profileImg").src = "https://s3.amazonaws.com/cs4241-fp/"+this.response[0].picname;
			document.getElementById("acctType").innerText = this.response[0].acctype;
        }
    };
    xhr.send();
	
};

function unameConfirm(){
	if(document.getElementById("username").value != ""){
	
	var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", "/get?target=users&username="+document.getElementById("username").value, true);
    xhr.onload = function() {
        if (this.status === 200) {
           
			if(this.response[0] == undefined){
				document.getElementById("unameComp").innerText = "";
				return true;
			}
			else{
				document.getElementById("unameComp").innerText = "This username is already taken.";
				return false;
			}
			
        }
    };
    xhr.send();	
	}
	else{
		document.getElementById("unameComp").innerText = "Please enter a username";
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


function signUp(){
	if(pwdConfirm() && unameConfirm()){
		//pass in everything to be added to db, pwds match and uname is unique
		
	}
	else{
		document.getElementById("pwdComp").style.backgroundColor = '#FF7777';
		document.getElementById("unameComp").style.backgroundColor = '#FF7777';
		
	}
};

function profileChangePwd(){
	if(pwdConfirm()){
		//make post request
		
	}
	else{
		document.getElementById("pwdComp").style.backgroundColor = '#FF7777';
		
	}
};

