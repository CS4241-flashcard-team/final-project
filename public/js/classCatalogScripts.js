function initCatalog() {
    getAllStudents();
    getProf();
}

function getProf() {
    const courseCode = window.sessionStorage.getItem('courseCode');
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", `/get?target=usersByCourseCode&courseCode=${courseCode}&filter=professor`, true);
    xhr.onload = function() {
        if (this.status === 200) {
            buildProfList(this.response);
        }
    };
    xhr.send();
}

function getAllStudents() {
    const courseCode = window.sessionStorage.getItem('courseCode');
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", `/get?target=usersByCourseCode&courseCode=${courseCode}&filter=student`, true);
    xhr.onload = function() {
        if (this.status === 200) {
            buildStudentsList(this.response);
        }
    };
    xhr.send();
}

var thumbnailTemplate = _.template(
    '<div class="col-md-4">' +
    '<div class="thumbnail">' +
    '<div class="picContainer">' +
    '<img id="<%= username %> pic" class="img-responsive img-rounded" src="https://s3.amazonaws.com/cs4241-fp/<%= picname %>" style="max-height: 250px">' +
    '</div>' +
    '<div class="caption">' +
    '<p><%= firstname %> <%= lastname %></p>' +
    '</div>' +
    '</div>' +
    '</div>'
);

var thumbnailTemplate2 = _.template(
    '<div class="col-md-12">' +
    '<div class="thumbnail">' +
    '<div class="picContainer">' +
    '<img id="<%= username %> pic" class="img-responsive img-rounded" src="https://s3.amazonaws.com/cs4241-fp/<%= picname %>" style="max-height: 250px">' +
    '</div>' +
    '<div class="caption">' +
    '<p><%= firstname %> <%= lastname %></p>' +
    '</div>' +
    '</div>' +
    '</div>'
);

function buildProfList(list) {
    var i, toAppendString = "";
    for (i = 0; i < list.length; i++) {
        toAppendString += thumbnailTemplate2(list[i]);
    }
    document.querySelector("#catalogProfRow").innerHTML = toAppendString;
}

function buildStudentsList(list) {
    var i, toAppendString = "";
    for (i = 0; i < list.length; i++) {
        toAppendString += thumbnailTemplate(list[i]);
    }
    document.querySelector("#catalogStudentsRow").innerHTML = toAppendString;
}
