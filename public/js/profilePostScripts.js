function checkLoggedIn() {
    if (localStorage.getItem("username") === null) {
        window.location.href = "/index.html";
    }
}
checkLoggedIn();

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
			
			document.getElementById("firstName").value = fName;
			document.getElementById("lastName").value = lName;
        }
    };
    xhr.send();
	
};

function profileChangePwd(event){
	if(pwd != document.getElementById("pwdOld").value){
		document.getElementById("pwdCheck").style.backgroundColor = '#FF7777';
		document.getElementById("pwdCheck").innerText ='Wrong Password!';
		event.preventDefault();
		return false;
	}
	
	//check if old password == entered password
	if(document.getElementById("passwordFirst").value == "" && document.getElementById("passwordConf").value == ""){
		document.getElementById("pwdCheck").innerText ='';
		return false;
	}
	if(!pwdConfirm()){
		document.getElementById("pwdComp").style.backgroundColor = '#FF7777';
		document.getElementById("pwdCheck").innerText ='';
		event.preventDefault();
		
		return false;
	}
	else {
		document.getElementById("pwdCheck").innerText ='';
		event.preventDefault();
		const data = {
			target: 'updateUser',
			username: uName,
			password: document.getElementById("passwordFirst").value,
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
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
			}
		};
		
		console.log(JSON.stringify(data));
		document.getElementsByTagName("form")[0].reset();
		document.getElementsByTagName("form")[1].reset();
		document.getElementsByTagName("form")[2].reset();
		document.getElementById("profPic").src = "#";
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
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
			}
		};
		
		console.log(JSON.stringify(data));
		document.getElementsByTagName("form")[0].reset();
		document.getElementsByTagName("form")[1].reset();
		document.getElementsByTagName("form")[2].reset();
		document.getElementById("profPic").src = "#";
		xhr.send(JSON.stringify(data));	
	}
};

function profileChangePic(event) {
    if(document.getElementById("profPic").value != "") {
        event.preventDefault();
       deleteFromS3();
    }
}

function deleteFromS3() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/s3?action=delete&fileName=${imgSrc}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("done get signed")
                getSignedReqToPutS3();
            }
            else {
                // error
                console.log('ERROR PUT S3')
            }
        }
    };
    xhr.send();
}

function getSignedReqToPutS3() {
    const file = document.getElementById('profPic').files[0];
    var fileName;

    if (file.type == 'image/png') {
        fileName = `${uName}.png`
    } else {
        fileName = `${uName}.jpg`
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/s3?action=put&fileName=${fileName}&fileType=${file.type}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("done get signed")
                const response = JSON.parse(xhr.responseText);
                addImageToS3(file, fileName, response.signedRequest);
            }
            else {
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
            	console.log("done add s3")
				updateImageDb(fileName)
            }
            else{
                // error
                console.log("error add image")
            }
        }
    };
    xhr.send(file);
}

function updateImageDb(fileName){
	const data = {
		target: 'updateUser',
		username: uName,
		password: pwd,
		firstname: fName,
		lastname: lName,
		picname: fileName,
		acctype: actType
	};

	var xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.open("POST", "/post");
	xhr.onload = function() {
		if (this.status === 200) {
			getProfileInfo(localKey);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            document.getElementById("profile").src = "blank.jpg";
            document.getElementById('profPic').value = '';
		}
	};
	xhr.send(JSON.stringify(data));
};

function signOut(){
    window.localStorage.clear();
    window.location.href = "index.html";
}