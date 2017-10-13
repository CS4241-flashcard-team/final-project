function initDashboard() {
    getAllCourses();
    getUserCourses();
    getProfileInfo(window.localStorage.getItem('username'));
}

function joinCourse(){
    const data = {
        target: 'joinCourse',
        courseCode: document.getElementById('selectCourse').value.substr(0, document.getElementById('selectCourse').value.indexOf(':')),
        username: window.localStorage.getItem('username')
    };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", "/post", true);
    xhr.onload = function() {
        if (this.status === 400) {
            console.log(this.response.message);
        }

        if (this.status === 200) {
            initDashboard();
        }
    };
    xhr.send(JSON.stringify(data));
}

function createCourse(){
    const data = {
        target: 'addCourse',
        courseCode: document.getElementById('selectDept').value +'-'+ document.getElementById('courseID').value + '-' + document.getElementById('courseTerm').value + document.getElementById('createYear').value,
        name: document.getElementById('createName').value,
        username: window.localStorage.getItem('username')
    };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", "/post", true);
    xhr.onload = function() {
        if (this.status === 400) {
            console.log(this.response.message);
        }

        if (this.status === 200) {
            initDashboard();
        }

        // clear and close modal
        document.getElementById('createName').value = '';
        document.getElementById('selectDept').value = 'AR';
        document.getElementById('courseID').value = '';
        document.getElementById('courseTerm').value = 'A';
        document.getElementById('createYear').value = '';
    };
    xhr.send(JSON.stringify(data));
}

function getAllCourses() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", "/get?target=courses", true);
    xhr.onload = function() {
        if (this.status === 200) {
            buildCourseJoin(this.response);
        }
    };
    xhr.send();
}

function getUserCourses() {
    const username = window.localStorage.getItem('username');
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", `/get?target=coursesByUsername&username=${username}`, true);
    xhr.onload = function() {
        if (this.status === 200) {
            buildFolder(this.response);
        }
    };
    xhr.send();
}

var actType = "";

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
            actType = this.response[0].acctype;
            console.log(actType);
            pwd = this.response[0].password;
            // Display the correct button for each type of account
            if(actType === "professor" || actType === "Professor"){
                console.log(actType);
                console.log("create button");
                document.getElementById("createBtn").style.display = ''
            }else{
                console.log(actType);
                console.log("join button");
                document.getElementById("joinBtn").style.display = ''
            }
        }
    };
    xhr.send();
};

var templateCourse = _.template(
    '<option>' +
    '<%= code %>' +
	':  <%= name %>'+
    '</option>' 
);

var template = _.template(
    '<div class="col-sm-3">' +

    '<button id="modalBtn" class="btn btn-default" data-toggle="modal" data-target="#<%= code %>Modal">' +
    '<img id= "folder" src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/folder-icon.png" width="20"/>' +
    '</button>' +

    '<p><%= code %> <%= name %></p>' +
    `<button type="button" onclick="leaveCourse('<%= code %>')" class="btn btn-danger btn-lg">Leave</button>`+

    '<div class="modal fade" id="<%= code %>Modal" role="dialog">' +
    '<div class="modal-dialog">' +
    '<div class="modal-content">' +

    '<div class="modal-header">' +
    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
    '<h4 class="modal-title">Choose your action</h4>' +
    '</div>'+

    '<div class="modal-body">'+
    `<button type="button" data-dismiss="modal" data-toggle="modal" href="#<%= code %>ModalLevel" class="btn btn-success btn-lg">Play</button>`+
    `<button type="button" onclick="toCatalog('<%= code %>')" class="btn btn-primary btn-lg">View Class</button>`+
    '</div>'+

    '</div>'+
    '</div>'+
    '</div>'+

    '<div class="modal fade" id="<%= code %>ModalLevel" role="dialog">' +
    '<div class="modal-dialog">' +
    '<div class="modal-content">'+

    '<div class="modal-header">' +
    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
    '<h4 class="modal-title">Choose difficulty</h4>' +
    '</div>'+

    '<div class="modal-body">'+
    `<button type="button" onclick="toGame('<%= code %>', 'easy')" class="btn btn-success btn-lg">Easy</button>`+
    `<button type="button" onclick="toGame('<%= code %>', 'normal')" class="btn btn-warning btn-lg">Normal</button>`+
    `<button type="button" onclick="toGame('<%= code %>', 'hard')" class="btn btn-danger btn-lg">Hard</button>`+
    '</div>'+

    '</div>'+
    '</div>'+
    '</div>'+

    '</div>'
);

function buildCourseJoin(list) {
    var i, toAppendString = "";
    for (i = 0; i < list.length; i++) {
        toAppendString += templateCourse(list[i]);
    }
    document.querySelector("#selectCourse").innerHTML = toAppendString;
}

function buildFolder(list) {
    var i, toAppendString = "";
    for (i = 0; i < list.length; i++) {
        toAppendString += template(list[i]);
    }
    document.querySelector("#courseRow").innerHTML = toAppendString;
    console.log(document.querySelector("#courseRow"))
}

function leaveCourse(code) {
    const data = {
        target: 'unjoinCourse',
        courseCode: code,
        username: window.localStorage.getItem('username')
    };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", "/post", true);
    xhr.onload = function() {
        if (this.status === 400) {
            console.log(this.response.message);
        }

        if (this.status === 200) {
            initDashboard();
        }
    };
    xhr.send(JSON.stringify(data));
}

function signOut(){
    console.log('signing out');
    window.localStorage.clear();
    window.location.href = "index.html";
}

function toGame(courseCode, difficulty){
    console.log('start playing');
    window.sessionStorage.setItem('courseCode', courseCode);
    window.sessionStorage.setItem('difficulty', difficulty);
    window.location.href = "game.html";
}

function toCatalog(courseCode){
    console.log('view all');
    window.sessionStorage.setItem('courseCode', courseCode);
    window.location.href = "classCatalog.html";
}