var uName = "";
var fName = "";
var lName = "";
var imgSrc = "";
var actType = "";
var pwd = "";
var localKey = "";

function getProfileInfo(localuser){
	var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", "/get?target=users&username="+localuser, true);
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(this.response);
			localKey = localuser;
			uName = this.response[0].username;
			fName = this.response[0].firstname;
			lName = this.response[0].lastname;
			imgSrc = this.response[0].picname;
			actType = this.response[0].acctype;
			pwd = this.response[0].password;
			
			document.getElementById("uname").innerText = uName;
			document.getElementById("first").innerText = fName;
			document.getElementById("last").innerText = lName;
			document.getElementById("profileImg").src = "https://s3.amazonaws.com/cs4241-fp/"+imgSrc;
			document.getElementById("acctType").innerText = actType;
        }
    };
    xhr.send();
	
};

function profileChangePwd(event){
	//check if old password == entered password
	
	if(!pwdConfirm()){
		document.getElementById("pwdComp").style.backgroundColor = '#FF7777';
		event.preventDefault();
		
		return false;
	}
	else if(document.getElementById("passwordFirst").value != "" && document.getElementById("passwordConf").value != ""){
		const data = {
			target: 'updateUser',
			password: document.getElementById("passwordFirst"),
			username: uName,
			firstname: fName,
			lastname: lName,
			picname: imgSrc,
			acctype: actType			
		};
		var xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.open("POST", "/post");
		xhr.onload = function() {
			if (this.status === 200) {
				getProfileInfo(localKey);
			}
		};
		xhr.send(JSON.stringify(data));	
	}
};


function profileChangeName(event){
	if(document.getElementById("firstName").value != "" && document.getElementById("lastName").value != ""){
		event.preventDefault();
		
		const data = {
			target: 'updateUser',
			username: uName,
			password: pwd,
			firstname: document.getElementById("firstName").value,
			lastname: document.getElementById("lastName").value,
			picname: imgSrc,
			acctype: actType			
		};
		var xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.open("POST", "/post");
		xhr.onload = function() {
			if (this.status === 200) {
			   getProfileInfo(localKey);
			}
		};
		
		console.log(JSON.stringify(data));
		
		xhr.send(JSON.stringify(data));	
	}
};

function profileChangePic(event){
	if(document.getElementById("profPic").value != ""){
		event.preventDefault();
		
		const data = {
			target: 'updateUser',
			username: uName,
			password: pwd,
			firstname: fName,
			lastname: lName,
			picname: document.getElementById("profPic").value,
			acctype: actType			
		};
		var xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.open("POST", "/post");
		xhr.onload = function() {
			if (this.status === 200) {
			   getProfileInfo(localKey);
			}
		};
		xhr.send(JSON.stringify(data));	
	}
};

function signOut(){
    window.localStorage.clear();
    window.location.href = "index.html";
}