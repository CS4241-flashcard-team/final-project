//Used for instant display of profile image
var updatePic = function (event) {
    document.getElementById('profile').src = URL.createObjectURL(event.target.files[0]);
};


function getValues(){
	if(xhr.readyState != 4){
		return;
	}
	
	if(xhr.status !=200){
		//error
		console.log("Error handling server response.");
	}

	//Stubs for getting information
	document.getElementById("uname").innerText = xhr.uname;
	document.getElementById("first").innerText = xhr.first;
	document.getElementById("last").innerText = xhr.last;
	document.getElementById("profileImg").src = xhr.src;
	document.getElementById("acctType").innerText = xhr.acctType;
	
};


function getProfileInfo(){
	/*var xhr = new XMLHttpRequest();

	xhr.open("GET", "/profilePage.html");
	xhr.send()
	xhr.onreadystatechange = function() {getValues(xhr)}
	*/
}