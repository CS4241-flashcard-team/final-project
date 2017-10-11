//Used for instant display of profile image
var updatePic = function (event) {
    document.getElementById('profile').src = URL.createObjectURL(event.target.files[0]);
};

function getValues(xhr){
	console.log("In getValues...readyState = "+xhr.readyState+" status="+xhr.status);
	if(xhr.readyState != 4){
		console.log("In getValues...readyState = "+xhr.readyState);
		return;
	}
	
	if(xhr.status !=200){
		//error
		console.log("Error handling server response. Error code:"+xhr.status);
	}

	//Stubs for getting information
	console.log(xhr.response);
	document.getElementById("uname").innerText = xhr.username;
	document.getElementById("first").innerText = xhr.firstname;
	document.getElementById("last").innerText = xhr.lastname;
	document.getElementById("profileImg").src = xhr.picname;
	document.getElementById("acctType").innerText = xhr.acctype;
	
};


function getProfileInfo(){
	/*var xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	console.log("In getProfileInfo...");
	xhr.open("GET", "/get?users&username=taylorSwift");
	xhr.send();
	xhr.onreadystatechange = function() {getValues(xhr)};
	
	*/
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

function joinCourse(){
	const data = {
		target: '',
		username: '',
		pwd: '',
		imgSrc: '',
		
	};
	
	xhr.open("GET", "/get?userByUsername&username=taylorSwift");
	xhr.send();
	xhr.onreadystatechange = function() {getValues(xhr)};
	
}


