function joinCourse(){
    const data = {
        target: 'addCourse',
        courseCode: document.getElementById('my-code').value,
        username: document.getElementById('my-username').value
    };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", "/post", true);
    xhr.onload = function() {
        if (this.status === 400) {
            console.log(this.response.message);
        }

        if (this.status === 200) {
            console.log('yay');
        }
    };
    xhr.send(JSON.stringify(data));
}

function createCourse(){
    const data = {
        target: 'addCourse',
        courseCode: document.getElementById('my-code').value,
        username: document.getElementById('my-username').value
    };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", "/post", true);
    xhr.onload = function() {
        if (this.status === 400) {
            console.log(this.response.message);
        }

        if (this.status === 200) {
            console.log('yay');
        }
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

var templateCourse = _.template(
    '<option>' +
    '<%= code %>' +
    '</option>' 
);

var template = _.template(
    '<div class="col-sm-3">' +

    '<button id="modalBtn" class="btn btn-default" data-toggle="modal" data-target="#playModal">' +
    '<img id= "folder" src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/folder-icon.png" width="20"/>' +
    '</button>' +

    '<p><%= code %> <%= name %></p>' +

    '<div class="modal fade" id="playModal" role="dialog">' +
    '<div class="modal-dialog">' +
    '<div class="modal-content">' +

    '<div class="modal-header">' +
    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
    '<h4 class="modal-title">Course Name</h4>' +
    '</div>'+

    '<div class="modal-body">'+
    '<button type="button" class="btn btn-success btn-lg">Play</button>'+
    '<button type="button" class="btn btn-primary btn-lg">View Class</button>'+
    '</div>'+

    '</div>'+
    '</div>'+
    '</div>'+

    '</div>'
); 

function buildCourseJoin(list) {
    console.log("here");
    var i, toAppendString = "";
    for (i = 0; i < list.length; i++) {
        toAppendString += templateCourse(list[i]);
    }
    console.log(toAppendString);
    document.querySelector("#selectCourse").innerHTML = toAppendString;
    console.log(document.querySelector("#selectCourse"))
}