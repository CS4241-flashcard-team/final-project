//Used for instant display of profile image
var updatePic = function (event) {
    document.getElementById('profile').src = URL.createObjectURL(event.target.files[0]);
};

