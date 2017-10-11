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
	console.log("xhr is: "+xhr.username);
	document.getElementById("uname").innerText = xhr.username;
	document.getElementById("first").innerText = xhr.firstname;
	document.getElementById("last").innerText = xhr.lastname;
	document.getElementById("profileImg").src = xhr.picname;
	document.getElementById("acctType").innerText = xhr.acctype;
	
};


function getProfileInfo(){
	var xhr = new XMLHttpRequest();
	console.log("In getProfileInfo...");
	xhr.open("GET", "/get?userByUsername&username=taylorSwift");
	xhr.send();
	xhr.onreadystatechange = function() {getValues(xhr)};
	
};